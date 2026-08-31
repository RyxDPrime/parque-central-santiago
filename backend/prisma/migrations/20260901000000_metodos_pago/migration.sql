-- El origen de los fondos se retira a peticion del Parque. La identidad del
-- donante y la declaracion de licitud se conservan: son las que sostienen el
-- aceptar o rechazar.
ALTER TABLE "Aporte" DROP COLUMN "origenFondos";
DROP TABLE "OrigenFondos";

-- Como piensa hacerse efectivo el aporte. No es dato de cumplimiento: es lo que
-- el equipo necesita para coordinar.
ALTER TABLE "Aporte" ADD COLUMN "metodoPago" TEXT;

-- CreateTable
CREATE TABLE "MetodoPago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nota" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("id")
);
