import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { env } from "../config/env";
import { requireAuth } from "../middleware/auth";

const uploadsPath = path.resolve(process.cwd(), env.uploadsDir);
fs.mkdirSync(uploadsPath, { recursive: true });

// La extensión se deriva del tipo permitido, nunca del nombre que envía el
// cliente. Antes se copiaba de `originalname`, y como el tipo declarado también
// lo controla el cliente, se podía subir un archivo .html haciéndolo pasar por
// imagen: al servirse desde /uploads salía como text/html y ejecutaba scripts
// en el dominio del backend.
const EXTENSION_POR_TIPO: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) => {
    const ext = EXTENSION_POR_TIPO[file.mimetype];
    if (!ext) {
      cb(new Error("Tipo de archivo no permitido"), "");
      return;
    }
    // Se conserva el nombre original solo como referencia legible, sin su
    // extensión y sin caracteres que puedan alterar la ruta.
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    cb(null, `${Date.now()}-${base || "archivo"}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 1 }, // 15 MB
  fileFilter: (_req, file, cb) => {
    cb(null, Object.prototype.hasOwnProperty.call(EXTENSION_POR_TIPO, file.mimetype));
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
