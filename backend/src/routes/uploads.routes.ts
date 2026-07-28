import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import { requireAuth } from "../middleware/auth";

const uploadsPath = path.resolve(process.cwd(), env.uploadsDir);
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .slice(0, 60);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

export const uploadsRouter = Router();

uploadsRouter.post("/uploads", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Archivo inválido o no enviado" });
    return;
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});
