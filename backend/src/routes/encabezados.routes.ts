import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso } from "../middleware/auth";

export const encabezadosRouter = Router();

/**
 * Mover la foto de un encabezado a otra página.
 *
 * La clave es lo que une cada registro con su página, es única, y las diecinueve
 * páginas ya tienen la suya. Así que "cambiar de página" no puede significar
 * reescribir la clave: no habría dónde ponerla, y una clave que ninguna página
 * pide deja esa página sin foto sin que nadie lo note.
 *
 * Lo que sí tiene sentido es lo que el equipo quiere hacer de verdad: esta foto
 * va en realidad en otra página. Eso es un intercambio —la foto y su encuadre
 * cambian de sitio entre los dos registros, las claves se quedan donde están— y
 * va en una transacción porque a medias dejaría la misma foto en dos páginas y
 * la otra perdida.
 */
encabezadosRouter.patch(
  "/encabezados/:id/mover",
  requireAuth,
  requirePermiso("contenido"),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const clave = typeof req.body?.clave === "string" ? req.body.clave : "";

      const [origen, destino] = await Promise.all([
        prisma.encabezadoPagina.findUnique({ where: { id } }),
        prisma.encabezadoPagina.findUnique({ where: { clave } }),
      ]);

      if (!origen) {
        res.status(404).json({ error: "Registro no encontrado" });
        return;
      }
      if (!destino) {
        res.status(400).json({ error: "Esa página no está en la lista." });
        return;
      }
      // Elegir la página en la que ya está no es un error: no hay nada que hacer.
      if (destino.id === origen.id) {
        res.json(origen);
        return;
      }

      await prisma.$transaction([
        prisma.encabezadoPagina.update({
          where: { id: origen.id },
          data: { imagenUrl: destino.imagenUrl, posicion: destino.posicion },
        }),
        prisma.encabezadoPagina.update({
          where: { id: destino.id },
          data: { imagenUrl: origen.imagenUrl, posicion: origen.posicion },
        }),
      ]);

      res.json({ ok: true, movidaA: destino.etiqueta });
    } catch (err) {
      next(err);
    }
  },
);
