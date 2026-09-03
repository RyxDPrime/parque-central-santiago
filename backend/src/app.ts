import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

export const app = express();

app.set("trust proxy", 1); // Railway sirve detrás de un proxy: necesario para el límite por IP

// Cabeceras de seguridad. Se desactiva la política de recursos cruzados porque
// el frontend está en otro dominio y necesita mostrar las imágenes de /uploads.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

// En desarrollo, Vite puede levantar el frontend en distintos puertos si el
// habitual está ocupado (5174, 5175, ...), así que se acepta cualquier origen
// de localhost. Se decide por la presencia de CORS_ORIGIN y no por NODE_ENV:
// esa variable no está definida en el despliegue (quitarla fue necesario para
// que la compilación instalara las dependencias de desarrollo), así que usarla
// dejaba el permiso de localhost activo también en producción.
const permitirLocalhost = env.corsOrigin === null;
const esLocalhost = (origin: string) => /^http:\/\/localhost:\d+$/.test(origin);

// Olvidar la variable no rompe nada visible en el servidor: la API sigue
// respondiendo, y es el sitio el que se queda en blanco sin decir por qué. Un
// aviso en el arranque es lo que convierte ese misterio en una línea de log.
if (permitirLocalhost) {
  console.warn(
    "CORS_ORIGIN no está definida: solo se aceptarán orígenes de localhost. " +
      "En producción esto deja al sitio sin poder leer la API, aunque la API responda bien.",
  );
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || (permitirLocalhost && esLocalhost(origin))) {
        callback(null, true);
        return;
      }
      callback(null, env.corsOrigin !== null && origin === env.corsOrigin);
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

// Los archivos subidos se sirven siempre como descarga y sin adivinar el tipo,
// para que ninguno pueda ejecutarse como página en el dominio del backend.
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), env.uploadsDir), {
    setHeaders(res) {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    },
  }),
);
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
