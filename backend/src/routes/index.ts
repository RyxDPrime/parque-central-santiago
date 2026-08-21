import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { contactoRouter } from "./contacto.routes";
import { contentRouter } from "./content.routes";
import { crudRoutes } from "./crud.routes";
import { apiLimiter } from "../middleware/rateLimit";
import { mensajesRouter } from "./mensajes.routes";
import { reservasRouter } from "./reservas.routes";
import { sugerenciasRouter } from "./sugerencias.routes";
import { uploadsRouter } from "./uploads.routes";
import { usuariosRouter } from "./usuarios.routes";

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
apiRouter.use(sugerenciasRouter);
apiRouter.use(reservasRouter);
apiRouter.use(usuariosRouter);

// Crear / editar / borrar (protegido) para las secciones administrables del panel.
// Todas llevan posición reordenable salvo Actividades, que se ordena por fecha.
apiRouter.use("/junta-directiva", crudRoutes("juntaDirectivo", { reorder: true }));
apiRouter.use("/personal-tecnico", crudRoutes("personalTecnico", { reorder: true }));
apiRouter.use("/instalaciones", crudRoutes("instalacion", { reorder: true }));
apiRouter.use("/programas", crudRoutes("programa", { reorder: true }));
apiRouter.use("/actividades", crudRoutes("actividad", { permiso: "comunicaciones" }));
apiRouter.use("/publicaciones", crudRoutes("publicacion", { permiso: "comunicaciones" }));
apiRouter.use("/puntos-mapa", crudRoutes("puntoMapa", { reorder: true }));
apiRouter.use("/hitos", crudRoutes("hito", { reorder: true }));
apiRouter.use("/normas", crudRoutes("norma", { reorder: true }));
apiRouter.use("/valores", crudRoutes("valor", { reorder: true }));
apiRouter.use("/pasos-reserva", crudRoutes("pasoReserva", { reorder: true }));
apiRouter.use("/formas-apoyo", crudRoutes("formaApoyo", { reorder: true }));
apiRouter.use("/espacios-reservables", crudRoutes("espacioReservable", { reorder: true }));
apiRouter.use("/tipos-actividad", crudRoutes("tipoActividad", { reorder: true }));
// Solo editar: el conjunto de plantillas es fijo. Si faltara la de una
// decision, esa decision se quedaria sin correo.
apiRouter.use("/plantillas-correo", crudRoutes("plantillaCorreo", { soloEditar: true, permiso: "comunicaciones" }));
apiRouter.use("/cifras", crudRoutes("cifra", { reorder: true }));
apiRouter.use("/aliados", crudRoutes("aliado", { reorder: true }));
apiRouter.use("/textos", crudRoutes("texto", { soloEditar: true }));
apiRouter.use("/encabezados", crudRoutes("encabezadoPagina", { soloEditar: true }));
apiRouter.use("/galeria", crudRoutes("galeriaItem", { reorder: true, permiso: "comunicaciones" }));
apiRouter.use("/documentos-financieros", crudRoutes("documentoFinanciero", { reorder: true }));
