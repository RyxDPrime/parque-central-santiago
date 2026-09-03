import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

/**
 * El origen que puede leer la API, o `null` si no se configuró ninguno.
 *
 * Se le quita la barra final: el navegador manda el origen sin ella
 * ("https://sitio.com"), así que copiar la dirección desde el navegador
 * —donde sí aparece— dejaba fuera al frontend entero sin ninguna pista:
 * la API responde bien y aun así el sitio no puede leerla.
 *
 * Vacía cuenta como no configurada. Antes caía a "*", que no permitía nada:
 * el asterisco se comparaba por igualdad contra el origen real del navegador
 * y no coincidía nunca, así que parecía un permiso abierto y era lo contrario.
 */
function normalizarOrigen(valor: string | undefined): string | null {
  const limpio = (valor ?? "").trim().replace(/\/+$/, "");
  return limpio === "" ? null : limpio;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigin: normalizarOrigen(process.env.CORS_ORIGIN),
  // Correo saliente. Se envia por HTTPS y no por SMTP: el servidor donde vive
  // el sitio tiene bloqueada la salida SMTP y ninguna credencial la sortea.
  // Sin la clave, los mensajes se siguen guardando en el panel pero no se
  // notifican por correo.
  brevoApiKey: process.env.BREVO_API_KEY ?? "",
  // Quien figura como remitente. Mientras no haya un dominio propio verificado,
  // el proveedor reescribe la direccion; el nombre si se respeta.
  mailFrom: process.env.MAIL_FROM ?? "Parque Central de Santiago <no-reply@parquecentralsantiago.com>",
  contactToEmail: required("CONTACT_TO_EMAIL", "asistentepcs@gmail.com"),
  // Firma la sesión del panel. Obligatorio: es mejor que el servidor no
  // arranque a que quede con un acceso que depende de un valor vacío.
  //
  // Ya no hay aquí usuario ni contraseña de administrador: desde que existe la
  // tabla de usuarios, el acceso al panel se comprueba contra ella. Las
  // variables ADMIN_USERNAME y ADMIN_PASSWORD_HASH solo las lee todavía
  // `scripts/crear-admin.mjs`, para crear la primera cuenta.
  jwtSecret: required("JWT_SECRET"),
  uploadsDir: process.env.UPLOADS_DIR ?? "uploads",
};
