import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { contactoRouter } from "./contacto.routes";
import { contentRouter } from "./content.routes";
import { crudRoutes } from "./crud.routes";
import { apiLimiter } from "../middleware/rateLimit";
import { mensajesRouter } from "./mensajes.routes";
import { uploadsRouter } from "./uploads.routes";

export const apiRouter = Router();

apiRouter.use(apiLimiter);

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true });
});

apiRouter.use(contentRouter);
apiRouter.use(contactoRouter);
apiRouter.use(adminRouter);
apiRouter.use(uploadsRouter);
apiRouter.use(mensajesRouter);

// Crear / editar / borrar (protegido) para las secciones administrables del panel.
// Todas llevan posición reordenable salvo Actividades, que se ordena por fecha.
apiRouter.use("/junta-directiva", crudRoutes("juntaDirectivo", { reorder: true }));
apiRouter.use("/personal-tecnico", crudRoutes("personalTecnico", { reorder: true }));
apiRouter.use("/instalaciones", crudRoutes("instalacion", { reorder: true }));
apiRouter.use("/programas", crudRoutes("programa", { reorder: true }));
apiRouter.use("/actividades", crudRoutes("actividad"));
apiRouter.use("/publicaciones", crudRoutes("publicacion"));
apiRouter.use("/puntos-mapa", crudRoutes("puntoMapa", { reorder: true }));
apiRouter.use("/hitos", crudRoutes("hito", { reorder: true }));
apiRouter.use("/normas", crudRoutes("norma", { reorder: true }));
apiRouter.use("/valores", crudRoutes("valor", { reorder: true }));
apiRouter.use("/pasos-reserva", crudRoutes("pasoReserva", { reorder: true }));
apiRouter.use("/formas-apoyo", crudRoutes("formaApoyo", { reorder: true }));
apiRouter.use("/cifras", crudRoutes("cifra", { reorder: true }));
apiRouter.use("/aliados", crudRoutes("aliado", { reorder: true }));
apiRouter.use("/textos", crudRoutes("texto", { soloEditar: true }));
apiRouter.use("/encabezados", crudRoutes("encabezadoPagina", { soloEditar: true }));
apiRouter.use("/galeria", crudRoutes("galeriaItem", { reorder: true }));
apiRouter.use("/documentos-financieros", crudRoutes("documentoFinanciero", { reorder: true }));
