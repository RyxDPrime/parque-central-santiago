import { z } from "zod";

export const contactoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es muy corto").max(120),
  email: z.string().trim().email("Email inválido"),
  telefono: z.string().trim().max(30).optional(),
  asunto: z.string().trim().max(150).optional(),
  mensaje: z.string().trim().min(10, "El mensaje es muy corto").max(4000),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
