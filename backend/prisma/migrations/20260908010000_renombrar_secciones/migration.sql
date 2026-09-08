-- Dos secciones cambian de nombre y de dirección:
--   instalaciones-y-servicios  ->  instalaciones
--   programas-y-proyectos      ->  programas-y-servicios
--
-- La primera dejó de mostrar servicios: los cinco que enseñaba eran los mismos
-- registros que la otra página, traídos de la misma ruta y pintados distinto.
-- Ahora viven en un solo sitio, y cada página se llama por lo que muestra.
--
-- Aquí se renombra la clave del encabezado de cada una. Es lo que une la franja
-- con su foto, así que sin esto las dos páginas quedarían con el fondo verde
-- liso y sus fotos huérfanas en el panel. La etiqueta se actualiza también,
-- porque es el nombre con el que el equipo del Parque las busca.
--
-- Las claves son únicas y las nuevas no existen todavía, así que no hay choque.

UPDATE "EncabezadoPagina"
SET "clave" = 'instalaciones', "etiqueta" = 'Instalaciones'
WHERE "clave" = 'instalaciones-y-servicios';

UPDATE "EncabezadoPagina"
SET "clave" = 'programas-y-servicios', "etiqueta" = 'Programas y Servicios'
WHERE "clave" = 'programas-y-proyectos';

-- Enlaces guardados que apuntaban a las direcciones viejas: hoy son los botones
-- de las cifras de la portada, que se eligen de una lista y no se escriben, pero
-- pudieron guardarse antes de que esa lista existiera.
UPDATE "Cifra" SET "enlaceUrl" = '/instalaciones'
WHERE "enlaceUrl" = '/instalaciones-y-servicios';

UPDATE "Cifra" SET "enlaceUrl" = '/programas-y-servicios'
WHERE "enlaceUrl" = '/programas-y-proyectos';
