import { z } from "zod";
import { unaLinea } from "./contacto.schema";

/** Estados por los que pasa una solicitud. Fuera de esta lista no hay ninguno. */
export const ESTADOS_SOLICITUD = ["pendiente", "aprobada", "rechazada", "cancelada"] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

/** "2026-09-14". Se valida el formato aparte de que la fecha exista de verdad. */
const fechaIso = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
  .refine((valor) => {
    const d = new Date(`${valor}T12:00:00`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor;
  }, "Esa fecha no existe");

const hora = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida");

export const solicitudReservaSchema = z
  .object({
    nombre: unaLinea(120).pipe(z.string().min(3, "Escribe tu nombre completo")),
    // Se guarda solo lo numérico: la misma cédula llega con guiones, con
    // espacios o pegada, y así dos formas de escribirla no parecen dos personas.
    cedula: z
      .string()
      .trim()
      .transform((valor) => valor.replace(/\D/g, ""))
      .pipe(z.string().length(11, "La cédula tiene 11 dígitos")),
    email: z.string().trim().max(200).email("Email inválido"),
    telefono: unaLinea(30).pipe(z.string().min(7, "Teléfono incompleto")),
    institucion: unaLinea(150).optional(),

    espacio: unaLinea(120).pipe(z.string().min(2, "Elige un espacio")),
    tipoActividad: unaLinea(120).pipe(z.string().min(2, "Elige el tipo de actividad")),

    fecha: fechaIso,
    horaInicio: hora,
    horaFin: hora,
    personas: z.coerce
      .number()
      .int()
      .min(1, "Indica cuántas personas")
      .max(5000, "Para un grupo así hay que coordinar por teléfono"),

    requerimientos: unaLinea(300).default(""),
    descripcion: z
      .string()
      .trim()
      .min(15, "Cuéntanos un poco más de la actividad")
      .max(2000, "La descripción es muy larga"),

    // Sin esto no se envía. El visitante confirma que leyó las condiciones, y
    // queda constancia de que las leyó antes de pedir.
    acepta: z.literal(true, {
      errorMap: () => ({ message: "Debes aceptar las condiciones de uso" }),
    }),
  })
  .refine((datos) => datos.horaFin > datos.horaInicio, {
    message: "La hora de salida debe ser después de la de entrada",
    path: ["horaFin"],
  })
  .refine((datos) => datos.fecha >= new Date().toISOString().slice(0, 10), {
    message: "No se puede solicitar una fecha que ya pasó",
    path: ["fecha"],
  });

export type SolicitudReservaInput = z.infer<typeof solicitudReservaSchema>;
