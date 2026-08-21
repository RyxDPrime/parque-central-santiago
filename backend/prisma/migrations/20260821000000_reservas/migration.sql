-- CreateTable
CREATE TABLE "EspacioReservable" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER,
    "capacidad" INTEGER,
    "requierePago" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EspacioReservable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoActividad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "permitido" BOOLEAN NOT NULL DEFAULT true,
    "nota" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudReserva" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "institucion" TEXT,
    "espacio" TEXT NOT NULL,
    "tipoActividad" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "personas" INTEGER NOT NULL,
    "requerimientos" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "motivo" TEXT,
    "notaInterna" TEXT,
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudReserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SolicitudReserva_fecha_idx" ON "SolicitudReserva"("fecha");
