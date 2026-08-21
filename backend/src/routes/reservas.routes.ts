import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso } from "../middleware/auth";
import { sendAcuseSolicitud, sendSolicitudReservaNotification } from "../config/mailer";
import { contactoLimiter } from "../middleware/rateLimit";
import { ESTADOS_SOLICITUD, solicitudReservaSchema } from "../schemas/reserva.schema";

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

      const actualizada = await prisma.solicitudReserva.update({
        where: { id: Number(req.params.id) },
        data: {
          estado,
          motivo: typeof req.body?.motivo === "string" ? req.body.motivo.slice(0, 500) : null,
          notaInterna:
            typeof req.body?.notaInterna === "string" ? req.body.notaInterna.slice(0, 1000) : undefined,
        },
      });
      res.json(actualizada);
    } catch (err) {
      next(err);
    }
  },
);

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
