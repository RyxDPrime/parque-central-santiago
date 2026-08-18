import dns from "node:dns";
import nodemailer from "nodemailer";
import { env } from "./env";

// Se resuelve primero por IPv4.
//
// El servidor de correo responde tanto en IPv6 como en IPv4, y Node prefiere
// IPv6; pero la maquina donde corre el sitio no tiene salida por IPv6, asi que
// el envio moria en "ENETUNREACH" antes siquiera de autenticarse. El sintoma
// enganna: parece un problema de usuario y clave, y no lo es.
dns.setDefaultResultOrder("ipv4first");

export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.secure,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

/** Extrae la direccion de un remitente con formato "Nombre <correo>". */
function direccionDe(remitente: string): string {
  const entre = remitente.match(/<([^>]+)>/);
  return (entre ? entre[1] : remitente).trim().toLowerCase();
}

// Aviso al arrancar. El envio con un From distinto al usuario autenticado no
// falla: el proveedor lo reescribe en silencio, asi que el sintoma es que los
// mensajes siguen saliendo a nombre de la cuenta vieja aunque MAIL_FROM diga
// otra cosa. Mejor verlo en los registros que descubrirlo por un reclamo.
const remitente = direccionDe(env.mailFrom);
if (env.smtp.user && remitente && remitente !== env.smtp.user.trim().toLowerCase()) {
  console.warn(
    `[correo] MAIL_FROM (${remitente}) no coincide con SMTP_USER (${env.smtp.user}). ` +
      "El proveedor reescribira el remitente al usuario autenticado.",
  );
}

interface ContactMailInput {
  nombre: string;
  email: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

export async function sendContactNotification(input: ContactMailInput): Promise<void> {
  const lines = [
    `Nombre: ${input.nombre}`,
    `Email: ${input.email}`,
    input.telefono ? `Teléfono: ${input.telefono}` : null,
    input.asunto ? `Asunto: ${input.asunto}` : null,
    "",
    input.mensaje,
  ].filter((line): line is string => line !== null);

  await transporter.sendMail({
    from: env.mailFrom,
    to: env.contactToEmail,
    replyTo: input.email,
    subject: `Nuevo mensaje de contacto — ${input.asunto || "Sitio web Parque Central"}`,
    text: lines.join("\n"),
  });
}
