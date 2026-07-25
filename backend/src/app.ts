import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

export const app = express();

// En desarrollo, Vite puede levantar el frontend en distintos puertos si el
// habitual está ocupado (5174, 5175, ...), así que se acepta cualquier
// origen de localhost en vez de fijar uno solo.
const isLocalhostOrigin = (origin: string) => /^http:\/\/localhost:\d+$/.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || (env.nodeEnv !== "production" && isLocalhostOrigin(origin))) {
        callback(null, true);
        return;
      }
      callback(null, origin === env.corsOrigin);
    },
  }),
);
app.use(express.json());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
