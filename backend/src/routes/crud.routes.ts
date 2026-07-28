import { Router } from "express";
import { requireAuth } from "../middleware/auth";

// Fábrica genérica de rutas crear/editar/borrar para un modelo de Prisma.
// Las 7 secciones administrables comparten la misma forma básica
// (una tabla con columnas simples + "orden"), así que en vez de repetir
// el mismo código 7 veces, se genera una sola vez por modelo.
// Se tipa como `any` a propósito: cada modelo de Prisma tiene su propio tipo
// estricto de "data" y no vale la pena reescribir esta fábrica por modelo
// solo para satisfacer eso; la validación real ocurre en la base de datos
// (columnas requeridas) y devuelve un error si el body no encaja.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function crudRoutes(model: any): Router {
  const router = Router();

  router.post("/", requireAuth, async (req, res, next) => {
    try {
      const created = await model.create({ data: req.body });
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", requireAuth, async (req, res, next) => {
    try {
      const updated = await model.update({
        where: { id: Number(req.params.id) },
        data: req.body,
      });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
      await model.delete({ where: { id: Number(req.params.id) } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
