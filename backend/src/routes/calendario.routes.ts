import { Router } from "express";
import { prisma } from "../config/db";
import { construirIcs } from "../config/calendario";
import { fechaLarga } from "../config/plantillas";

export const calendarioRouter = Router();

/** El .ics se descarga; no es una página. */
function responderIcs(res: import("express").Response, archivo: string, contenido: string): void {
  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${archivo}"`);
  res.send(contenido);
}

/**
 * Todas las reservas aprobadas, para suscribirse desde un calendario.
 *
 * Lleva lo mismo que la ruta de ocupación y por la misma razón: una dirección
 * de suscripción se copia, se pega en un chat y acaba donde nadie previó. Si
 * llevara nombres y teléfonos, compartir el calendario del Parque con un
 * voluntario seria entregarle los datos de todo el que reservo.
 *
 * Quien necesite saber quién pidió qué lo mira en el panel, que pide sesión.
 */
calendarioRouter.get("/calendario/reservas.ics", async (_req, res, next) => {
  try {
    // Un mes hacia atrás: un calendario que empieza hoy deja al equipo sin ver
    // lo que pasó la semana pasada, que es justo lo que se consulta al revisar.
    const desde = new Date();
    desde.setMonth(desde.getMonth() - 1);

    const reservas = await prisma.solicitudReserva.findMany({
      where: { estado: "aprobada", fecha: { gte: desde.toISOString().slice(0, 10) } },
      orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
      select: {
        id: true,
        espacio: true,
        fecha: true,
        horaInicio: true,
        horaFin: true,
        tipoActividad: true,
        personas: true,
      },
    });

    responderIcs(
      res,
      "reservas-parque-central.ics",
      construirIcs(
        "Reservas · Parque Central de Santiago",
        reservas.map((r) => ({
          id: `reserva-${r.id}`,
          titulo: `${r.espacio} — ${r.tipoActividad}`,
          fecha: r.fecha,
          horaInicio: r.horaInicio,
          horaFin: r.horaFin,
          descripcion: `${r.tipoActividad}. Unas ${r.personas} personas.`,
          lugar: `${r.espacio}, Parque Central de Santiago`,
        })),
      ),
    );
  } catch (err) {
    next(err);
  }
});

/**
 * Una sola reserva, la de quien tiene la clave.
 *
 * El enlace se le manda por correo al aprobarla. Va por clave y no por id
 * porque con el id bastaria con contar de uno en uno para bajarse las reservas
 * de todo el mundo.
 *
 * Solo responde si esta aprobada: mientras este pendiente no hay nada que
 * meter en un calendario, y meterlo antes es justo el malentendido que el
 * sistema entero trata de evitar.
 */
calendarioRouter.get("/calendario/solicitud/:token.ics", async (req, res, next) => {
  try {
    const token = String(req.params.token ?? "");
    const r = token
      ? await prisma.solicitudReserva.findUnique({ where: { token } })
      : null;

    if (!r || r.estado !== "aprobada") {
      res.status(404).json({
        error: "No encontramos esa reserva, o todavia no esta aprobada.",
      });
      return;
    }

    const detalle = [
      `${r.tipoActividad} en ${r.espacio}.`,
      r.requerimientos ? `Pediste: ${r.requerimientos}.` : "",
      r.montajeFecha
        ? `Montaje: ${fechaLarga(r.montajeFecha)}${r.montajeHora ? ` a las ${r.montajeHora}` : ""}.`
        : "",
      "Parque Central de Santiago · 809-583-9581",
    ]
      .filter(Boolean)
      .join(" ");

    responderIcs(
      res,
      "mi-reserva-parque-central.ics",
      construirIcs("Mi reserva en el Parque Central", [
        {
          id: `solicitud-${r.id}`,
          titulo: `${r.tipoActividad} — ${r.espacio}`,
          fecha: r.fecha,
          horaInicio: r.horaInicio,
          horaFin: r.horaFin,
          descripcion: detalle,
          lugar: `${r.espacio}, Parque Central de Santiago`,
        },
      ]),
    );
  } catch (err) {
    next(err);
  }
});
