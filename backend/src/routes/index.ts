import { Router } from "express";
import { prisma } from "../config/db";
import { adminRouter } from "./admin.routes";
import { contactoRouter } from "./contacto.routes";
import { contentRouter } from "./content.routes";
import { crudRoutes } from "./crud.routes";
import { mensajesRouter } from "./mensajes.routes";
import { uploadsRouter } from "./uploads.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true });
});

apiRouter.use(contentRouter);
apiRouter.use(contactoRouter);
apiRouter.use(adminRouter);
apiRouter.use(uploadsRouter);
apiRouter.use(mensajesRouter);

// Crear / editar / borrar (protegido) para las secciones administrables del panel.
apiRouter.use("/junta-directiva", crudRoutes(prisma.juntaDirectivo));
apiRouter.use("/personal-tecnico", crudRoutes(prisma.personalTecnico));
apiRouter.use("/instalaciones", crudRoutes(prisma.instalacion));
apiRouter.use("/programas", crudRoutes(prisma.programa));
apiRouter.use("/actividades", crudRoutes(prisma.actividad));
apiRouter.use("/galeria", crudRoutes(prisma.galeriaItem));
apiRouter.use("/documentos-financieros", crudRoutes(prisma.documentoFinanciero));
