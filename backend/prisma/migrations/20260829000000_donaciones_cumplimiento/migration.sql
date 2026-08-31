-- Origen de los fondos y constancia de la decision
ALTER TABLE "Aporte" ADD COLUMN "donanteTipo" TEXT;
ALTER TABLE "Aporte" ADD COLUMN "documento" TEXT;
ALTER TABLE "Aporte" ADD COLUMN "origenFondos" TEXT;
ALTER TABLE "Aporte" ADD COLUMN "esPep" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Aporte" ADD COLUMN "declaraLicito" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Aporte" ADD COLUMN "motivoRechazo" TEXT;
ALTER TABLE "Aporte" ADD COLUMN "decididaPor" TEXT;
ALTER TABLE "Aporte" ADD COLUMN "decididaEn" TIMESTAMP(3);

-- Los estados pasan a nombrar la decision y no el tramite: aceptar o rechazar
-- un aporte es una decision que hay que poder sostener, y "atendida" no dice
-- si el dinero se recibio o no.
UPDATE "Aporte" SET "estado" = 'aceptada'  WHERE "estado" = 'atendida';
UPDATE "Aporte" SET "estado" = 'rechazada' WHERE "estado" = 'descartada';

-- CreateTable
CREATE TABLE "MotivoRechazo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nota" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotivoRechazo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrigenFondos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrigenFondos_pkey" PRIMARY KEY ("id")
);
