-- Foto propia para instalaciones y programas. Antes se resolvían con una tabla
-- de nombres escrita en el frontend, así que un registro nuevo nunca podía
-- tener foto sin tocar el código.
ALTER TABLE "Instalacion" ADD COLUMN "fotoUrl" TEXT;
ALTER TABLE "Programa" ADD COLUMN "fotoUrl" TEXT;
