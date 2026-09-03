import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso } from "../middleware/auth";
import { sendAcuseSolicitud, sendSolicitudReservaNotification } from "../config/mailer";
import { contactoLimiter } from "../middleware/rateLimit";
import { ESTADOS_SOLICITUD, solicitudReservaSchema } from "../schemas/reserva.schema";
import { HUECOS_POR_FAMILIA, PLANTILLAS, enviarRespuestaSolicitud } from "../config/plantillas";

export const reservasRouter = Router();

// ── Público ──

// Solo los espacios activos: dar de baja uno en el panel debe sacarlo del
// formulario, no obligar a borrarlo y perder su descripción.
reservasRouter.get("/espacios-reservables", async (_req, res, next) => {
  try {
    res.json(
      await prisma.espacioReservable.findMany({
        where: { activo: true },
        orderBy: { orden: "asc" },
      }),
    );
  } catch (err) {
    next(err);
  }
});

/**
 * El mismo listado, pero con los dados de baja incluidos, para el panel.
 *
 * Hace falta una ruta aparte porque si el panel usara la de arriba, desmarcar
 * "disponible para solicitar" haría desaparecer el espacio de la única pantalla
 * desde la que se puede volver a activar: dar de baja equivaldría a perderlo.
 */
reservasRouter.get(
  "/espacios-reservables-todos",
  requireAuth,
  requirePermiso("contenido"),
  async (_req, res, next) => {
    try {
      res.json(await prisma.espacioReservable.findMany({ orderBy: { orden: "asc" } }));
    } catch (err) {
      next(err);
    }
  },
);

// Van los permitidos y los no permitidos: los primeros llenan la lista del
// formulario, los segundos se publican al lado para que quien iba a pedir algo
// que no procede se entere antes y no después.
reservasRouter.get("/tipos-actividad", async (_req, res, next) => {
  try {
    res.json(await prisma.tipoActividad.findMany({ orderBy: { orden: "asc" } }));
  } catch (err) {
    next(err);
  }
});

/**
 * Lo que ya está apartado, para que el visitante lo vea antes de pedir.
 *
 * Solo las aprobadas y solo espacio, fecha y hora: quién reservó y para qué es
 * asunto del Parque, no de quien está mirando la página.
 */
reservasRouter.get("/reservas-ocupadas", async (req, res, next) => {
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    const desde = typeof req.query.desde === "string" ? req.query.desde : hoy;
    const hasta = typeof req.query.hasta === "string" ? req.query.hasta : undefined;

    res.json(
      await prisma.solicitudReserva.findMany({
        where: {
          estado: "aprobada",
          fecha: { gte: desde, ...(hasta ? { lte: hasta } : {}) },
        },
        orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
        select: { id: true, espacio: true, fecha: true, horaInicio: true, horaFin: true },
      }),
    );
  } catch (err) {
    next(err);
  }
});

/**
 * Enviar una solicitud.
 *
 * Se guarda siempre, aunque los correos fallen: la bandeja del panel es la
 * copia que no depende de que un servicio externo responda.
 */
reservasRouter.post("/solicitudes-reserva", contactoLimiter, async (req, res, next) => {
  try {
    const { acepta, ...datos } = solicitudReservaSchema.parse(req.body);
    void acepta;

    // El desplegable del formulario solo esconde lo que no se permite; esto es
    // lo que de verdad lo impide. Sin esta comprobacion, una peticion directa a
    // la API con tipoActividad: "Misa" entraria igual, y la lista cerrada seria
    // una apariencia. Se consulta contra la base y no contra una lista escrita
    // aqui, para que lo que el Parque cambie en el panel valga de inmediato.
    const [tipo, espacio] = await Promise.all([
      prisma.tipoActividad.findFirst({ where: { nombre: datos.tipoActividad } }),
      prisma.espacioReservable.findFirst({ where: { nombre: datos.espacio } }),
    ]);

    if (!tipo || !tipo.permitido) {
      res.status(400).json({
        error: !tipo
          ? "Ese tipo de actividad no esta en la lista. Elige uno del desplegable."
          : `El Parque no permite esa actividad: ${tipo.nombre}.`,
      });
      return;
    }

    if (!espacio || !espacio.activo) {
      res.status(400).json({
        error: "Ese espacio no esta disponible para reservar. Elige uno del desplegable.",
      });
      return;
    }

    const guardada = await prisma.solicitudReserva.create({ data: datos });

    try {
      await sendSolicitudReservaNotification(datos);
      // El acuse va después del aviso al Parque: si solo uno de los dos sale,
      // que sea el que le llega a quien tiene que actuar.
      await sendAcuseSolicitud(datos);
      await prisma.solicitudReserva.update({
        where: { id: guardada.id },
        data: { emailEnviado: true },
      });
    } catch (mailErr) {
      console.error("No se pudo enviar el correo de la solicitud:", mailErr);
    }

    res.status(201).json({ ok: true, id: guardada.id });
  } catch (err) {
    next(err);
  }
});

// ── Panel ──

reservasRouter.get(
  "/solicitudes-reserva",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (_req, res, next) => {
    try {
      res.json(
        await prisma.solicitudReserva.findMany({
          orderBy: [{ createdAt: "desc" }],
        }),
      );
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Las reservas ya aprobadas que chocan con una solicitud: mismo espacio, mismo
 * dia y horas que se pisan.
 *
 * Dos franjas se solapan cuando cada una empieza antes de que la otra termine;
 * que una empiece justo cuando la otra acaba no es choque. Las horas se
 * comparan como texto porque van guardadas en "HH:MM" con el cero delante, y
 * en ese formato el orden alfabetico es el orden del reloj.
 */
async function reservasQueChocan(solicitud: {
  id: number;
  espacio: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}) {
  return prisma.solicitudReserva.findMany({
    where: {
      id: { not: solicitud.id },
      estado: "aprobada",
      espacio: solicitud.espacio,
      fecha: solicitud.fecha,
      horaInicio: { lt: solicitud.horaFin },
      horaFin: { gt: solicitud.horaInicio },
    },
    orderBy: { horaInicio: "asc" },
  });
}

/**
 * Cuantos se pueden apartar a la vez. Un espacio con `cantidad` (ocho kioscos
 * grandes) admite tantas reservas simultaneas como unidades tenga; sin ese
 * dato, es uno solo.
 */
async function cupoDelEspacio(nombre: string): Promise<number> {
  const espacio = await prisma.espacioReservable.findFirst({ where: { nombre } });
  const cantidad = espacio?.cantidad ?? 0;
  return cantidad > 0 ? cantidad : 1;
}

/**
 * Decidir una solicitud.
 *
 * Aprobar o rechazar le escribe a quien la pidió, con la plantilla que el
 * Parque tenga guardada para esa decisión. El correo va DESPUÉS de guardar el
 * estado y su fallo no tumba la operación: si el proveedor de correo está
 * caído, la decisión igual queda registrada, y la bandeja muestra que la
 * persona no fue notificada en vez de darlo por hecho.
 *
 * Cancelar no manda nada: suele hacerse de acuerdo con la persona, que ya está
 * enterada.
 *
 * Aprobar es lo unico que aparta algo de verdad, asi que es lo unico que se
 * comprueba contra lo ya apartado: sin esto, dos solicitudes del mismo espacio
 * a la misma hora se podian aprobar las dos y el choque aparecia el dia de la
 * actividad. No lo impide del todo —el Parque puede tener una razon para
 * hacerlo igual— pero obliga a decirlo a proposito con `forzar`.
 */
reservasRouter.patch(
  "/solicitudes-reserva/:id",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (req, res, next) => {
    try {
      const estado = String(req.body?.estado ?? "");
      if (!ESTADOS_SOLICITUD.includes(estado as (typeof ESTADOS_SOLICITUD)[number])) {
        res.status(400).json({ error: "Estado inválido" });
        return;
      }
      const motivo = typeof req.body?.motivo === "string" ? req.body.motivo.slice(0, 500) : null;
      // Permite decidir sin avisar, para el caso en que ya se habló con la
      // persona por teléfono y un correo automático sobraría.
      const avisar = req.body?.avisar !== false;
      const id = Number(req.params.id);

      if (estado === "aprobada" && req.body?.forzar !== true) {
        const solicitud = await prisma.solicitudReserva.findUnique({ where: { id } });
        if (!solicitud) {
          res.status(404).json({ error: "Registro no encontrado" });
          return;
        }

        const choques = await reservasQueChocan(solicitud);
        const cupo = await cupoDelEspacio(solicitud.espacio);

        if (choques.length >= cupo) {
          const detalle = choques
            .map((c) => `${c.nombre} (${c.horaInicio}-${c.horaFin})`)
            .join(", ");
          // Se responde 409 y con `conflicto` para que el panel sepa que no es
          // un error suyo, sino algo que el Parque puede decidir saltarse.
          res.status(409).json({
            conflicto: true,
            error:
              cupo > 1
                ? `Ese día a esa hora ya están apartados los ${cupo} de "${solicitud.espacio}": ${detalle}.`
                : `"${solicitud.espacio}" ya está apartado ese día a esa hora: ${detalle}.`,
          });
          return;
        }
      }

      let actualizada = await prisma.solicitudReserva.update({
        where: { id },
        data: {
          estado,
          motivo,
          notaInterna:
            typeof req.body?.notaInterna === "string" ? req.body.notaInterna.slice(0, 1000) : undefined,
          respuestaEnviada: false,
          respuestaError: null,
        },
      });

      const clave =
        estado === "aprobada"
          ? PLANTILLAS.reservaAprobada
          : estado === "rechazada"
            ? PLANTILLAS.reservaRechazada
            : null;

      if (clave && avisar) {
        try {
          await enviarRespuestaSolicitud(clave, actualizada);
          actualizada = await prisma.solicitudReserva.update({
            where: { id: actualizada.id },
            data: { respuestaEnviada: true },
          });
        } catch (mailErr) {
          const detalle = mailErr instanceof Error ? mailErr.message : "Error al enviar";
          console.error("No se pudo enviar la respuesta de la solicitud:", mailErr);
          actualizada = await prisma.solicitudReserva.update({
            where: { id: actualizada.id },
            data: { respuestaError: detalle.slice(0, 300) },
          });
        }
      }

      res.json(actualizada);
    } catch (err) {
      next(err);
    }
  },
);

// ── Plantillas de respuesta ──

// Solo con sesión: no son secretas, pero tampoco tienen por qué estar en la web.
reservasRouter.get(
  "/plantillas-correo",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (_req, res, next) => {
    try {
      res.json(await prisma.plantillaCorreo.findMany({ orderBy: { orden: "asc" } }));
    } catch (err) {
      next(err);
    }
  },
);

// Los huecos salen del servidor para que el panel muestre siempre los que de
// verdad existen, y no una lista copiada que se quede vieja. Van agrupados por
// familia porque {{espacio}} no significa nada dentro de un correo de donacion.
reservasRouter.get("/plantillas-huecos", requireAuth, (_req, res) => {
  res.json(HUECOS_POR_FAMILIA);
});

reservasRouter.delete(
  "/solicitudes-reserva/:id",
  requireAuth,
  requirePermiso("comunicaciones"),
  async (req, res, next) => {
    try {
      await prisma.solicitudReserva.delete({ where: { id: Number(req.params.id) } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);
