import { Router } from "express";
import { contactoRouter } from "./contacto.routes";
import { contentRouter } from "./content.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true });
});

apiRouter.use(contentRouter);
apiRouter.use(contactoRouter);
