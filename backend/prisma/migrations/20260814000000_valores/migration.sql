-- Valores institucionales, para la pagina de Mision, Vision y Valores.
CREATE TABLE "Valor" (
    "id" SERIAL NOT NULL,
    "icono" TEXT NOT NULL DEFAULT 'ti-heart-handshake',
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valor_pkey" PRIMARY KEY ("id")
);
