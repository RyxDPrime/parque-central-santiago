import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  // Se le quita la barra final: el navegador manda el origen sin ella
  // ("https://sitio.com"), así que copiar la dirección desde el navegador
  // —donde sí aparece— dejaba fuera al frontend entero sin ninguna pista:
  // la API responde bien y aun así el sitio no puede leerla.
  corsOrigin: (process.env.CORS_ORIGIN ?? "*").trim().replace(/\/+$/, ""),
  // Correo saliente. Se envia por HTTPS y no por SMTP: el servidor donde vive
  // el sitio tiene bloqueada la salida SMTP y ninguna credencial la sortea.
  // Sin la clave, los mensajes se siguen guardando en el panel pero no se
  // notifican por correo.
  brevoApiKey: process.env.BREVO_API_KEY ?? "",
  // Quien figura como remitente. Mientras no haya un dominio propio verificado,
  // el proveedor reescribe la direccion; el nombre si se respeta.
  mailFrom: process.env.MAIL_FROM ?? "Parque Central de Santiago <no-reply@parquecentralsantiago.com>",
  contactToEmail: required("CONTACT_TO_EMAIL", "asistentepcs@gmail.com"),
  admin: {
    // Obligatorios: si faltan, es mejor que el servidor no arranque que quedar
    // con un panel cuyo acceso depende de valores vacíos.
    username: required("ADMIN_USERNAME"),
    // Hash bcrypt de la contraseña de administrador (generar con scripts/hash-password.ts)
    passwordHash: required("ADMIN_PASSWORD_HASH"),
  },
  jwtSecret: required("JWT_SECRET"),
  uploadsDir: process.env.UPLOADS_DIR ?? "uploads",
};
