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

/**
 * Separa "uno@x.com, dos@y.com" en direcciones. Tolera espacios y comas de mas
 * —una lista escrita a mano en un panel de configuracion los tiene— y descarta
 * duplicados, que de otro modo mandarian el mismo aviso dos veces a la misma
 * bandeja.
 */
function listaDeCorreos(valor: string): string[] {
  const direcciones = valor
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d !== "");
  const unicas = [...new Set(direcciones.map((d) => d.toLowerCase()))];
  if (unicas.length === 0) {
    throw new Error("CONTACT_TO_EMAIL no tiene ninguna direccion valida");
  }
  return unicas;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  // La conexion a la base. Antes la leia Prisma por su cuenta desde el esquema;
  // desde la version 7 se le pasa al cliente al crearlo, en db.ts. Obligatoria:
  // sin base no hay nada que servir.
  databaseUrl: required("DATABASE_URL"),
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
  // A donde llegan los formularios. Admite varias direcciones separadas por
  // coma: el Parque quiere que los avisos entren tanto al correo institucional
  // como a la cuenta que la administracion ya revisa a diario, para que el
  // cambio de una no deje a nadie sin ver una solicitud.
  contactToEmails: listaDeCorreos(
    required("CONTACT_TO_EMAIL", "info@parquecentralsantiagord.com"),
  ),
  // Firma la sesión del panel. Obligatorio: es mejor que el servidor no
  // arranque a que quede con un acceso que depende de un valor vacío.
  //
  // Ya no hay aquí usuario ni contraseña de administrador: desde que existe la
  // tabla de usuarios, el acceso al panel se comprueba contra ella. Las
  // variables ADMIN_USERNAME y ADMIN_PASSWORD_HASH solo las lee todavía
  // `scripts/crear-admin.mjs`, para crear la primera cuenta.
  jwtSecret: required("JWT_SECRET"),
  uploadsDir: process.env.UPLOADS_DIR ?? "uploads",
  // Donde vive el sitio de cara al publico. Se usa para armar enlaces que van
  // dentro de un correo, donde una ruta relativa no lleva a ningun lado.
  // Por omision cae al origen autorizado, que en la practica es el mismo.
  sitioUrl: (process.env.SITE_URL ?? normalizarOrigen(process.env.CORS_ORIGIN) ?? "https://www.parquecentralsantiagord.com").replace(/\/+$/, ""),
};
