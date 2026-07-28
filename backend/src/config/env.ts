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
  mailFrom: process.env.MAIL_FROM ?? "Parque Central de Santiago <no-reply@parquecentralsantiago.com>",
  contactToEmail: required("CONTACT_TO_EMAIL", "asistentepcs@gmail.com"),
  admin: {
    username: process.env.ADMIN_USERNAME ?? "",
    // Hash bcrypt de la contraseña de administrador (generar con scripts/hash-password.ts)
    passwordHash: process.env.ADMIN_PASSWORD_HASH ?? "",
  },
  jwtSecret: process.env.JWT_SECRET ?? "",
  uploadsDir: process.env.UPLOADS_DIR ?? "uploads",
};
