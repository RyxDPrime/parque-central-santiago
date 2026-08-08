import { z } from "zod";

/**
 * Deja el texto en una sola línea. Importa porque "asunto" termina en el
 * encabezado Subject del correo, y un salto de línea ahí permitiría inyectar
 * encabezados extra (por ejemplo un Bcc). `trim()` no alcanza, porque solo
 * recorta los extremos.
 *
 * Se filtra por código de carácter en vez de con una expresión regular para no
 * tener caracteres de control escritos dentro del código fuente.
 */
function unaSolaLinea(valor: string): string {
  const limpio = Array.from(valor)
    .map((c) => {
      const codigo = c.charCodeAt(0);
      return codigo < 32 || codigo === 127 ? " " : c;
    })
    .join("");
  return limpio.replace(/\s{2,}/g, " ").trim();
}

const unaLinea = (max: number) => z.string().trim().max(max).transform(unaSolaLinea);

export const contactoSchema = z.object({
  nombre: unaLinea(120).pipe(z.string().min(2, "El nombre es muy corto")),
  email: z.string().trim().max(200).email("Email inválido"),
  telefono: unaLinea(30).optional(),
  asunto: unaLinea(150).optional(),
  // El mensaje va en el cuerpo del correo, no en un encabezado, así que
  // conserva sus saltos de línea.
  mensaje: z.string().trim().min(10, "El mensaje es muy corto").max(4000),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
