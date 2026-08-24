import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso } from "../middleware/auth";
import { sendAcuseAporte, sendAporteNotification } from "../config/mailer";
import { contactoLimiter } from "../middleware/rateLimit";
import { ESTADOS_APORTE, aporteSchema } from "../schemas/aporte.schema";
import { PLANTILLAS, enviarPlantilla, valoresAporte } from "../config/plantillas";

export const aportesRouter = Router();

/**
 * Alguien quiere aportar.
 *
 * El sitio no cobra nada: esto es una intención, y de ahí en adelante lo lleva
 * una persona del Parque. Se guarda siempre, aunque los correos fallen, porque
 * la bandeja del panel es la copia que no depende de un servicio externo.
 */
aportesRouter.post("/aportes", contactoLimiter, async (req, res, next) => {
  try {
    const datos = aporteSchema.parse(req.body);
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
 * Marcar un aporte como atendido o descartado.
 *
 * Al atenderlo se le escribe a la persona con la plantilla guardada, y lo que
 * se ponga en `respuesta` entra en ese correo. Descartar no manda nada: se usa
 * para lo que no procede o para lo que ya se resolvió por teléfono.
 */
aportesRouter.patch(
  "/aportes/:id",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (req, res, next) => {
    try {
      const estado = String(req.body?.estado ?? "");
      if (!ESTADOS_APORTE.includes(estado as (typeof ESTADOS_APORTE)[number])) {
        res.status(400).json({ error: "Estado inválido" });
        return;
      }
      const respuesta =
        typeof req.body?.respuesta === "string" ? req.body.respuesta.slice(0, 2000) : "";
      const avisar = req.body?.avisar !== false && estado === "atendida";

      let actualizado = await prisma.aporte.update({
        where: { id: Number(req.params.id) },
        data: {
          estado,
          notaInterna:
            typeof req.body?.notaInterna === "string"
              ? req.body.notaInterna.slice(0, 1000)
              : undefined,
          respuestaEnviada: false,
          respuestaError: null,
        },
      });

      if (avisar) {
        try {
          await enviarPlantilla(
            PLANTILLAS.aporteRespuesta,
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
