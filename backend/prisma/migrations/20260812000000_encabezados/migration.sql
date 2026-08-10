-- CreateTable
CREATE TABLE "EncabezadoPagina" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "posicion" TEXT NOT NULL DEFAULT 'center',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EncabezadoPagina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncabezadoPagina_clave_key" ON "EncabezadoPagina"("clave");
