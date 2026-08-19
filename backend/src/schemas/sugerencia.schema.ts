import { z } from "zod";
import { unaLinea } from "./contacto.schema";

/** Lo que el visitante puede enviar. Fuera de esta lista no hay opcion. */
export const TIPOS_SUGERENCIA = ["sugerencia", "felicitacion", "queja", "otro"] as const;

export const sugerenciaSchema = z.object({
  tipo: z.enum(TIPOS_SUGERENCIA).default("sugerencia"),
  nombre: unaLinea(120).pipe(z.string().min(2, "El nombre es muy corto")),
  email: z.string().trim().max(200).email("Email inválido"),
  telefono: unaLinea(30).optional(),
  // El mensaje va en el cuerpo del correo, no en un encabezado, asi que
  // conserva sus saltos de linea.
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más")
    .max(4000, "El mensaje es muy largo"),
});

export type SugerenciaInput = z.infer<typeof sugerenciaSchema>;
