-- CreateTable
CREATE TABLE "Hito" (
    "id" SERIAL NOT NULL,
    "fecha" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Hito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Norma" (
    "id" SERIAL NOT NULL,
    "icono" TEXT NOT NULL DEFAULT 'ti-info-circle',
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Norma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasoReserva" (
    "id" SERIAL NOT NULL,
    "icono" TEXT NOT NULL DEFAULT 'ti-circle-check',
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PasoReserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormaApoyo" (
    "id" SERIAL NOT NULL,
    "icono" TEXT NOT NULL DEFAULT 'ti-heart-handshake',
    "etiqueta" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FormaApoyo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cifra" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "etiqueta" TEXT,
    "enlaceTexto" TEXT,
    "enlaceUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cifra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Texto" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "grupo" TEXT NOT NULL DEFAULT 'General',
    "valor" TEXT NOT NULL,
    "multiline" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Texto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Texto_clave_key" ON "Texto"("clave");
