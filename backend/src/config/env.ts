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
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    // Google muestra las contraseñas de aplicación con espacios para lectura humana,
    // pero SMTP las espera sin espacios.
    pass: (process.env.SMTP_PASS ?? "").replace(/\s+/g, ""),
  },
  // El remitente tiene que ser la misma cuenta con la que se autentica el
  // envio: Gmail reescribe el From al usuario autenticado, asi que poner otra
  // direccion no cambia lo que ve quien recibe, solo confunde a quien configura.
  // Por eso el valor por defecto se deriva de SMTP_USER en vez de inventar una
  // direccion que nunca llegaria a usarse.
  mailFrom:
    process.env.MAIL_FROM ??
    (process.env.SMTP_USER ? `Parque Central de Santiago <${process.env.SMTP_USER}>` : ""),
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
