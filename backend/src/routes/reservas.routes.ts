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

      let actualizada = await prisma.solicitudReserva.update({
        where: { id: Number(req.params.id) },
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
