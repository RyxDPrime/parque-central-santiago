-- CreateTable
CREATE TABLE "CuentaBancaria" (
    "id" SERIAL NOT NULL,
    "banco" TEXT NOT NULL,
    "tipoCuenta" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "titular" TEXT NOT NULL,
    "rnc" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'DOP',
    "nota" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaBancaria_pkey" PRIMARY KEY ("id")
);

-- Los datos bancarios pasan de textos sueltos a esta tabla. Se borran las
-- claves viejas para que no queden dos sitios donde editar lo mismo, que es
-- peor que uno: alguien actualizaria uno y el sitio mostraria el otro.
DELETE FROM "Texto" WHERE "clave" IN (
  'donaciones.banco',
  'donaciones.tipoCuenta',
  'donaciones.cuenta',
  'donaciones.titular',
  'donaciones.rnc'
);
