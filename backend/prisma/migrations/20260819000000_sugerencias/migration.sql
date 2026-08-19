-- Sugerencias y comunicaciones enviadas desde el sitio.
CREATE TABLE "Sugerencia" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'sugerencia',
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sugerencia_pkey" PRIMARY KEY ("id")
);

-- Se listan siempre de la mas reciente a la mas antigua.
CREATE INDEX "Sugerencia_createdAt_idx" ON "Sugerencia"("createdAt" DESC);
