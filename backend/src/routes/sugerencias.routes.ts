import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso } from "../middleware/auth";
import { sendSugerenciaNotification } from "../config/mailer";
import { contactoLimiter } from "../middleware/rateLimit";
import { sugerenciaSchema } from "../schemas/sugerencia.schema";

export const sugerenciasRouter = Router();

// Envio publico. Se guarda siempre, aunque el correo falle: la bandeja del
// panel es la copia que no depende de que el envio salga.
sugerenciasRouter.post("/sugerencias", contactoLimiter, async (req, res, next) => {
  try {
    const input = sugerenciaSchema.parse(req.body);
    const guardada = await prisma.sugerencia.create({ data: input });

    try {
      await sendSugerenciaNotification(input);
      await prisma.sugerencia.update({
        where: { id: guardada.id },
        data: { emailEnviado: true },
      });
    } catch (mailErr) {
      console.error("No se pudo enviar el correo de sugerencia:", mailErr);
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Bandeja del panel: leer, marcar como leida y borrar. No se crean desde aqui.
sugerenciasRouter.get("/sugerencias", requireAuth, requirePermiso("comunicaciones"), async (_req, res, next) => {
  try {
    res.json(await prisma.sugerencia.findMany({ orderBy: { createdAt: "desc" } }));
  } catch (err) {
    next(err);
  }
});

sugerenciasRouter.patch("/sugerencias/:id", requireAuth, requirePermiso("comunicaciones"), async (req, res, next) => {
  try {
    const actualizada = await prisma.sugerencia.update({
      where: { id: Number(req.params.id) },
      data: { leida: Boolean(req.body?.leida) },
    });
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
});

sugerenciasRouter.delete("/sugerencias/:id", requireAuth, requirePermiso("comunicaciones"), async (req, res, next) => {
  try {
    await prisma.sugerencia.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
