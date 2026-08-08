import rateLimit from "express-rate-limit";

/**
 * Límite para el inicio de sesión. La contraseña del panel es una sola y
 * compartida, así que sin esto se podría probar contraseñas sin freno.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Demasiados intentos. Espera unos minutos y vuelve a probar." },
});

/**
 * Límite para el formulario de contacto, que es público: evita que se use para
 * inundar de correos la bandeja del parque.
 */
export const contactoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Recibimos varios mensajes desde este dispositivo. Intenta más tarde." },
});

/** Límite general de la API, como red de seguridad. */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
