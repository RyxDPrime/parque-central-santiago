import { env } from "./env";

/**
 * Envío de correo por HTTPS, a través de Brevo.
 *
 * No se usa SMTP porque el servidor donde vive el sitio tiene bloqueada esa
 * salida —es una restricción del plan, no de la configuración—, y ninguna
 * credencial la sortea. Una API por HTTPS sale por el puerto 443, que siempre
 * está abierto.
 *
 * Todo lo propio del proveedor vive en este archivo: cambiar de servicio es
 * reescribir `enviarCorreo`, sin tocar quién manda correos ni por qué.
 */

const API = "https://api.brevo.com/v3/smtp/email";

export interface CorreoSalida {
  asunto: string;
  texto: string;
  /** A quién le responde el destinatario al pulsar "Responder". */
  responderA?: { email: string; nombre?: string };
  /**
   * A quién se le manda. Por omisión, al Parque: casi todo lo que sale de aquí
   * es un aviso interno. Se indica solo cuando el destinatario es el visitante,
   * como en el acuse de una solicitud de reserva.
   */
  para?: { email: string; nombre?: string };
}

/** Separa "Nombre <correo>" en sus dos partes. */
function partirRemitente(remitente: string): { email: string; name?: string } {
  const conNombre = remitente.match(/^\s*(.+?)\s*<([^>]+)>\s*$/);
  if (conNombre) return { name: conNombre[1], email: conNombre[2] };
  return { email: remitente.trim() };
}

export function hayCorreoConfigurado(): boolean {
  return Boolean(env.brevoApiKey && env.mailFrom && env.contactToEmail);
}

export async function enviarCorreo({ asunto, texto, responderA, para }: CorreoSalida): Promise<void> {
  if (!hayCorreoConfigurado()) {
    throw new Error("Falta configurar el correo: BREVO_API_KEY, MAIL_FROM o CONTACT_TO_EMAIL");
  }

  const respuesta = await fetch(API, {
    method: "POST",
    headers: {
      "api-key": env.brevoApiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: partirRemitente(env.mailFrom),
      to: [para ? { email: para.email, name: para.nombre } : { email: env.contactToEmail }],
      replyTo: responderA,
      subject: asunto,
      textContent: texto,
    }),
  });

  if (!respuesta.ok) {
    // El cuerpo del error trae el motivo exacto (clave inválida, remitente sin
    // verificar, cuota agotada); sin él, depurar esto es adivinar.
    const detalle = await respuesta.text().catch(() => "");
    throw new Error(`Brevo respondió ${respuesta.status}: ${detalle.slice(0, 300)}`);
  }
}
