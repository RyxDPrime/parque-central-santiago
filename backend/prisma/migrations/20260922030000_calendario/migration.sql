-- Clave propia de cada solicitud, para el enlace de calendario.
--
-- Al aprobar una solicitud se le manda a quien la pidió un enlace para meterla
-- en su calendario. Ese enlace no puede llevar el id: bastaría con contar de
-- uno en uno para leer las reservas de todo el mundo. Lleva esta clave, larga
-- y aleatoria.
--
-- Las solicitudes que ya existían se quedan sin clave; el enlace solo aparece
-- en las que se aprueben de ahora en adelante.

ALTER TABLE "SolicitudReserva" ADD COLUMN IF NOT EXISTS "token" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "SolicitudReserva_token_key" ON "SolicitudReserva"("token");
