-- Los puntos pasan de porcentajes sobre una foto a coordenadas geograficas.
-- Se renombran las columnas para no perder las filas ya cargadas; los valores
-- viejos (0-100) quedan sin sentido como coordenadas, asi que se reemplazan
-- por el centro del parque y se reubican desde el panel.
ALTER TABLE "PuntoMapa" RENAME COLUMN "x" TO "lat";
ALTER TABLE "PuntoMapa" RENAME COLUMN "y" TO "lng";

ALTER TABLE "PuntoMapa" ALTER COLUMN "lat" SET DEFAULT 19.4667;
ALTER TABLE "PuntoMapa" ALTER COLUMN "lng" SET DEFAULT -70.6953;

UPDATE "PuntoMapa" SET "lat" = 19.4667, "lng" = -70.6953;
