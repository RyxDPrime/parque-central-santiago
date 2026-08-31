import { z } from "zod";
import { unaLinea } from "./contacto.schema";

/** Las tres formas de aportar que el Parque decidio recibir por el sitio. */
export const TIPOS_APORTE = ["dinero", "patrocinio", "voluntariado"] as const;
export type TipoAporte = (typeof TIPOS_APORTE)[number];

/**
 * Los estados nombran la decision, no el tramite.
 *
 * Antes eran "atendida" y "descartada", que decian si alguien se habia ocupado.
 * Un aporte se acepta o se rechaza, y esa decision hay que poder sostenerla
 * despues: por eso se llama por su nombre y queda con motivo, autor y fecha.
 */
export const ESTADOS_APORTE = ["pendiente", "aceptada", "rechazada"] as const;

/** Quien aporta: una persona o una empresa. Cambia que documento se le pide. */
export const TIPOS_DONANTE = ["persona", "empresa"] as const;

export const aporteSchema = z
  .object({
    tipo: z.enum(TIPOS_APORTE),
    nombre: unaLinea(120).pipe(z.string().min(3, "Escribe tu nombre completo")),
    email: z.string().trim().max(200).email("Email inválido"),
    telefono: unaLinea(30).pipe(z.string().min(7, "Teléfono incompleto")),
    institucion: unaLinea(150).optional(),

    // Opcional a proposito: obligar a poner una cifra antes de hablar con nadie
    // espanta a quien todavia esta decidiendo cuanto puede dar.
    monto: z.coerce
      .number()
      .int()
      .min(1, "El monto debe ser mayor que cero")
      .max(100_000_000, "Para un aporte así conviene que hablemos por teléfono")
      .optional(),
    frecuencia: z.enum(["unica", "mensual"]).optional(),

    mensaje: z
      .string()
      .trim()
      .min(10, "Cuéntanos un poco más")
      .max(2000, "El mensaje es muy largo"),

    // ── Origen de los fondos ──
    // Solo se piden por encima del umbral que fije el Parque. La comprobacion
    // de si hacian falta esta en la ruta, que es donde se conoce ese umbral.
    donanteTipo: z.enum(TIPOS_DONANTE).optional(),
    documento: unaLinea(30).optional(),
    origenFondos: unaLinea(150).optional(),
    esPep: z.coerce.boolean().optional(),
    declaraLicito: z.coerce.boolean().optional(),
  })
  // Un patrocinio institucional sin institucion no se puede tramitar: es el
  // unico dato que distingue a la empresa de la persona que la representa.
  .refine((d) => d.tipo !== "patrocinio" || Boolean(d.institucion?.trim()), {
    message: "Indica la empresa o institución que representas",
    path: ["institucion"],
  })
  // Monto y frecuencia solo tienen sentido en dinero; en los otros dos se
  // ignoran para que no queden datos sueltos que nadie sabe interpretar.
  .transform((d) =>
    d.tipo === "dinero" ? d : { ...d, monto: undefined, frecuencia: undefined },
  );

export type AporteInput = z.infer<typeof aporteSchema>;

/**
 * La decision del Parque sobre un aporte.
 *
 * Rechazar exige motivo. No es burocracia: una negativa sin razon registrada no
 * se puede explicar despues, ni contar, ni revisar si fue consistente con la
 * que se tomo en un caso parecido.
 */
export const decisionAporteSchema = z
  .object({
    estado: z.enum(ESTADOS_APORTE),
    motivoRechazo: unaLinea(200).optional(),
    respuesta: z.string().trim().max(2000).optional(),
    notaInterna: z.string().trim().max(1000).optional(),
    avisar: z.boolean().optional(),
  })
  .refine((d) => d.estado !== "rechazada" || Boolean(d.motivoRechazo?.trim()), {
    message: "Un rechazo tiene que llevar el motivo",
    path: ["motivoRechazo"],
  });
