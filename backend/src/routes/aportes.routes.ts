import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso, type AuthedRequest } from "../middleware/auth";
import { sendAcuseAporte, sendAporteNotification } from "../config/mailer";
import { contactoLimiter } from "../middleware/rateLimit";
import { aporteSchema, decisionAporteSchema } from "../schemas/aporte.schema";
import { PLANTILLAS, enviarPlantilla, valoresAporte } from "../config/plantillas";

export const aportesRouter = Router();

/**
 * Alguien quiere aportar.
 *
 * El sitio no cobra nada: esto es una intención, y de ahí en adelante lo lleva
 * una persona del Parque. Se guarda siempre, aunque los correos fallen, porque
 * la bandeja del panel es la copia que no depende de un servicio externo.
 */
/**
 * El umbral a partir del cual hay que declarar el origen de los fondos.
 *
 * Sale del panel y no del codigo porque es una decision del Parque y de su
 * asesor legal, no nuestra. En cero, se le pide a todo el mundo.
 */
async function umbralDeclaracion(): Promise<number> {
  const texto = await prisma.texto.findUnique({ where: { clave: "donaciones.umbral" } });
  const valor = Number((texto?.valor ?? "").replace(/\D/g, ""));
  return Number.isFinite(valor) && valor > 0 ? valor : 0;
}

aportesRouter.post("/aportes", contactoLimiter, async (req, res, next) => {
  try {
    const datos = aporteSchema.parse(req.body);

    // Un patrocinio institucional siempre declara, sin importar el monto: por
    // definicion viene de una empresa y suele ser la cifra grande.
    const umbral = await umbralDeclaracion();
    const debeDeclarar =
      datos.tipo === "patrocinio" || (datos.tipo === "dinero" && (datos.monto ?? 0) >= umbral);

    if (debeDeclarar) {
      if (!datos.donanteTipo || !datos.documento) {
        res.status(400).json({
          error: "Para un aporte de este tipo hace falta que digas quién eres.",
        });
        return;
      }
      if (!datos.declaraLicito) {
        res.status(400).json({ error: "Debes declarar que los fondos son de origen lícito." });
        return;
      }
    }

    // El método de pago se elige de una lista cerrada, y solo entre los que
    // estén disponibles: si no, alguien podría anunciar que va a pagar con
    // tarjeta antes de que exista la pasarela.
    if (datos.tipo !== "voluntariado") {
      if (!datos.metodoPago) {
        res.status(400).json({ error: "Indica cómo harías el aporte." });
        return;
      }
      const metodo = await prisma.metodoPago.findFirst({
        where: { nombre: datos.metodoPago, activo: true, disponible: true },
      });
      if (!metodo) {
        res.status(400).json({ error: "Esa forma de aportar no está disponible. Elige una de la lista." });
        return;
      }
    }

    const guardado = await prisma.aporte.create({ data: datos });

    try {
      await sendAporteNotification(datos);
      // El acuse va después del aviso al Parque: si solo uno de los dos sale,
      // que sea el que le llega a quien tiene que actuar.
      await sendAcuseAporte(datos);
      await prisma.aporte.update({ where: { id: guardado.id }, data: { emailEnviado: true } });
    } catch (mailErr) {
      console.error("No se pudo enviar el correo del aporte:", mailErr);
    }

    res.status(201).json({ ok: true, id: guardado.id });
  } catch (err) {
    next(err);
  }
});

// Las formas de aportar. Publica: la necesita el formulario. Van tambien las
// que no estan disponibles todavia, para poder anunciarlas sin dejar elegirlas.
aportesRouter.get("/metodos-pago", async (_req, res, next) => {
  try {
    res.json(await prisma.metodoPago.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }));
  } catch (err) {
    next(err);
  }
});

// Los motivos de rechazo NO son publicos: son la constancia interna de por que
// el Parque dijo que no, y no tienen por que estar a la vista de nadie mas.
aportesRouter.get(
  "/motivos-rechazo",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (_req, res, next) => {
    try {
      res.json(await prisma.motivoRechazo.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }));
    } catch (err) {
      next(err);
    }
  },
);

// ── Cuentas bancarias ──

// Solo las activas: cerrar una cuenta en el panel debe sacarla del sitio sin
// obligar a borrarla, que es como se pierde el historial de a donde entro que.
aportesRouter.get("/cuentas-bancarias", async (_req, res, next) => {
  try {
    res.json(
      await prisma.cuentaBancaria.findMany({ where: { activa: true }, orderBy: { orden: "asc" } }),
    );
  } catch (err) {
    next(err);
  }
});

// El mismo listado con las cerradas incluidas, para el panel: si no, cerrar una
// la haria desaparecer de la unica pantalla desde la que se puede reabrir.
aportesRouter.get(
  "/cuentas-bancarias-todas",
  requireAuth,
  requirePermiso("contenido"),
  async (_req, res, next) => {
    try {
      res.json(await prisma.cuentaBancaria.findMany({ orderBy: { orden: "asc" } }));
    } catch (err) {
      next(err);
    }
  },
);

// ── Panel ──

aportesRouter.get(
  "/aportes",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (_req, res, next) => {
    try {
      res.json(await prisma.aporte.findMany({ orderBy: { createdAt: "desc" } }));
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Aceptar o rechazar un aporte.
 *
 * Es una decisión, no un trámite: queda con motivo, con autor y con fecha,
 * porque tiene que poder explicarse después. Un aporte rechazado sin razón
 * registrada no se puede sostener ante nadie ni contrastar con el criterio que
 * se usó en un caso parecido.
 *
 * El motivo del rechazo es INTERNO y no viaja en ningún correo. Lo que recibe
 * quien aportó es un texto neutro que el Parque redacta aparte: explicarle a
 * alguien por qué se sospecha de su dinero no le corresponde a un correo
 * automático.
 */
aportesRouter.patch(
  "/aportes/:id",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (req: AuthedRequest, res, next) => {
    try {
      const { estado, motivoRechazo, respuesta, notaInterna, avisar } =
        decisionAporteSchema.parse(req.body);

      // El motivo sale de la lista que mantiene el Parque, no de texto libre:
      // así dos personas rechazan lo mismo por la misma razón, y se puede
      // contar después cuántos se rechazaron por cada una.
      if (estado === "rechazada") {
        const motivo = await prisma.motivoRechazo.findFirst({
          where: { nombre: motivoRechazo, activo: true },
        });
        if (!motivo) {
          res.status(400).json({ error: "Ese motivo de rechazo no está en la lista." });
          return;
        }
      }

      const decidida = estado !== "pendiente";
      let actualizado = await prisma.aporte.update({
        where: { id: Number(req.params.id) },
        data: {
          estado,
          motivoRechazo: estado === "rechazada" ? motivoRechazo : null,
          // Quién y cuándo. Sin esto, la constancia dice "alguien lo rechazó",
          // que no es una explicación.
          decididaPor: decidida ? (req.usuario?.usuario ?? null) : null,
          decididaEn: decidida ? new Date() : null,
          notaInterna,
          respuestaEnviada: false,
          respuestaError: null,
        },
      });

      const clave =
        estado === "aceptada"
          ? PLANTILLAS.aporteAceptado
          : estado === "rechazada"
            ? PLANTILLAS.aporteRechazado
            : null;

      if (clave && avisar !== false) {
        try {
          await enviarPlantilla(
            clave,
            // `respuesta` es lo que el equipo redacta para la persona. El
            // motivo interno no se pasa: no está entre los huecos disponibles.
            valoresAporte({ ...actualizado, respuesta }),
            { email: actualizado.email, nombre: actualizado.nombre },
          );
          actualizado = await prisma.aporte.update({
            where: { id: actualizado.id },
            data: { respuestaEnviada: true },
          });
        } catch (mailErr) {
          const detalle = mailErr instanceof Error ? mailErr.message : "Error al enviar";
          console.error("No se pudo enviar la respuesta del aporte:", mailErr);
          actualizado = await prisma.aporte.update({
            where: { id: actualizado.id },
            data: { respuestaError: detalle.slice(0, 300) },
          });
        }
      }

      res.json(actualizado);
    } catch (err) {
      next(err);
    }
  },
);

aportesRouter.delete(
  "/aportes/:id",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (req, res, next) => {
    try {
      await prisma.aporte.delete({ where: { id: Number(req.params.id) } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);
