import { z } from "zod";
import { unaLinea } from "./contacto.schema";

/** Las tres formas de aportar que el Parque decidio recibir por el sitio. */
export const TIPOS_APORTE = ["dinero", "patrocinio", "voluntariado"] as const;
export type TipoAporte = (typeof TIPOS_APORTE)[number];

export const ESTADOS_APORTE = ["pendiente", "atendida", "descartada"] as const;

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
