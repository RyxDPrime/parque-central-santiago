-- CreateTable
CREATE TABLE "Aporte" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "institucion" TEXT,
    "monto" INTEGER,
    "frecuencia" TEXT,
    "mensaje" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "notaInterna" TEXT,
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "respuestaEnviada" BOOLEAN NOT NULL DEFAULT false,
    "respuestaError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Aporte_estado_idx" ON "Aporte"("estado");
