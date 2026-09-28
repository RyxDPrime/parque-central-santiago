-- El correo de aprobacion trae el enlace para guardar la actividad en el
-- calendario de quien la pidio.
--
-- Se inserta despues del bloque de lo reservado y del motivo. Solo si la
-- plantilla todavia tiene ese bloque tal como se sembro y no lleva ya el
-- enlace: si el Parque la reescribio desde el panel, no se toca, y el hueco
-- {{enlaceCalendario}} queda disponible para que lo agregue donde prefiera.
--
-- Va dos veces, una por cada forma de salto de linea. La plantilla se sembro
-- desde un archivo que, segun la maquina donde se corrio, pudo guardarse con
-- saltos de Windows (CRLF) o de Unix (LF). Una sola forma dejaria la migracion
-- sin efecto en el otro caso, y sin avisar. Cada una solo actua si encuentra su
-- propia forma y el enlace no esta todavia, asi que no pueden duplicarlo.

UPDATE "PlantillaCorreo"
SET "cuerpo" = REPLACE("cuerpo", E'{{motivo}}\r\n\r\nANTES DE VENIR', E'{{motivo}}\r\n\r\n{{enlaceCalendario}}\r\n\r\nANTES DE VENIR'),
    "updatedAt" = NOW()
WHERE "clave" = 'reserva.aprobada'
  AND "cuerpo" LIKE E'%{{motivo}}\r\n\r\nANTES DE VENIR%'
  AND "cuerpo" NOT LIKE '%enlaceCalendario%';

UPDATE "PlantillaCorreo"
SET "cuerpo" = REPLACE("cuerpo", E'{{motivo}}\n\nANTES DE VENIR', E'{{motivo}}\n\n{{enlaceCalendario}}\n\nANTES DE VENIR'),
    "updatedAt" = NOW()
WHERE "clave" = 'reserva.aprobada'
  AND "cuerpo" LIKE E'%{{motivo}}\n\nANTES DE VENIR%'
  AND "cuerpo" NOT LIKE '%enlaceCalendario%';
