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
