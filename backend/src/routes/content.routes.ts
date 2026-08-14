import { Router } from "express";
import { prisma } from "../config/db";

export const contentRouter = Router();

contentRouter.get("/junta-directiva", async (_req, res, next) => {
  try {
    const data = await prisma.juntaDirectivo.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/personal-tecnico", async (_req, res, next) => {
  try {
    const data = await prisma.personalTecnico.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/instalaciones", async (_req, res, next) => {
  try {
    const data = await prisma.instalacion.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/programas", async (_req, res, next) => {
  try {
    const data = await prisma.programa.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/actividades", async (_req, res, next) => {
  try {
    const data = await prisma.actividad.findMany({ orderBy: { fechaInicio: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/galeria", async (_req, res, next) => {
  try {
    const data = await prisma.galeriaItem.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/puntos-mapa", async (_req, res, next) => {
  try {
    const data = await prisma.puntoMapa.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Blog: se ordena por fecha, de la más reciente a la más antigua.
contentRouter.get("/publicaciones", async (_req, res, next) => {
  try {
    const data = await prisma.publicacion.findMany({ orderBy: { fecha: "desc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/aliados", async (_req, res, next) => {
  try {
    const data = await prisma.aliado.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/documentos-financieros", async (_req, res, next) => {
  try {
    const data = await prisma.documentoFinanciero.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Contenido de secciones, editable desde el panel.
const listasSimples = [
  ["hitos", "hito"],
  ["normas", "norma"],
  ["valores", "valor"],
  ["pasos-reserva", "pasoReserva"],
  ["formas-apoyo", "formaApoyo"],
  ["cifras", "cifra"],
] as const;

for (const [ruta, modelo] of listasSimples) {
  contentRouter.get(`/${ruta}`, async (_req, res, next) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await (prisma as any)[modelo].findMany({ orderBy: { orden: "asc" } });
      res.json(data);
    } catch (err) {
      next(err);
    }
  });
}

contentRouter.get("/textos", async (_req, res, next) => {
  try {
    const data = await prisma.texto.findMany({ orderBy: [{ grupo: "asc" }, { orden: "asc" }] });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

contentRouter.get("/encabezados", async (_req, res, next) => {
  try {
    const data = await prisma.encabezadoPagina.findMany({ orderBy: { orden: "asc" } });
    res.json(data);
  } catch (err) {
    next(err);
  }
});
