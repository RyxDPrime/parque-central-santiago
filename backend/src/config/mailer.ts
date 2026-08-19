import { enviarCorreo } from "./correo";

/**
 * Los dos correos que el sitio envia al Parque: el del formulario de contacto y
 * el de sugerencias. Aqui solo se arma el texto; de mandarlo se encarga
 * `correo.ts`, que es el unico que sabe por donde sale.
 */

interface ContactMailInput {
  nombre: string;
  email: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

export async function sendContactNotification(input: ContactMailInput): Promise<void> {
  const lineas = [
    `Nombre: ${input.nombre}`,
    `Email: ${input.email}`,
    input.telefono ? `Telefono: ${input.telefono}` : null,
    input.asunto ? `Asunto: ${input.asunto}` : null,
    "",
    input.mensaje,
  ].filter((linea): linea is string => linea !== null);

  await enviarCorreo({
    asunto: `Nuevo mensaje de contacto - ${input.asunto || "Sitio web Parque Central"}`,
    texto: lineas.join("\n"),
    // Responder le escribe al visitante, no al propio Parque.
    responderA: { email: input.email, nombre: input.nombre },
  });
}

const ETIQUETA_TIPO: Record<string, string> = {
  sugerencia: "Sugerencia",
  felicitacion: "Felicitacion",
  queja: "Queja",
  otro: "Comunicacion",
};

interface SugerenciaMailInput {
  tipo: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

export async function sendSugerenciaNotification(input: SugerenciaMailInput): Promise<void> {
  const etiqueta = ETIQUETA_TIPO[input.tipo] ?? "Comunicacion";
  const lineas = [
    `Tipo: ${etiqueta}`,
    `Nombre: ${input.nombre}`,
    `Email: ${input.email}`,
    input.telefono ? `Telefono: ${input.telefono}` : null,
    "",
    input.mensaje,
  ].filter((linea): linea is string => linea !== null);

  await enviarCorreo({
    asunto: `${etiqueta} desde el sitio web - ${input.nombre}`,
    texto: lineas.join("\n"),
    responderA: { email: input.email, nombre: input.nombre },
  });
}
