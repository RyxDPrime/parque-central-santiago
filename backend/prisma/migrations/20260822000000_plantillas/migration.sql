-- CreateTable
CREATE TABLE "PlantillaCorreo" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "asunto" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantillaCorreo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantillaCorreo_clave_key" ON "PlantillaCorreo"("clave");

-- AlterTable
ALTER TABLE "SolicitudReserva" ADD COLUMN "respuestaEnviada" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SolicitudReserva" ADD COLUMN "respuestaError" TEXT;
