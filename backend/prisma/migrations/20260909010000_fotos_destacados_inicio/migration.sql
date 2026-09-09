-- Reparacion de la siembra anterior.
--
-- Al darle al carrusel de la portada su propia lista, las diapositivas se
-- copiaron de los programas tomando su campo "fotoUrl". Cuatro programas lo
-- tienen vacio: nunca les subieron foto al panel. En la pagina eso no se veia
-- porque el codigo del sitio, cuando un programa no traia foto, le ponia una de
-- reserva guardada por nombre. La copia se llevo el campo vacio y no la foto
-- que en realidad se estaba viendo, asi que esas cuatro diapositivas quedaron
-- con la foto generica de la entrada del parque.
--
-- Aqui se les pone la que se veia antes. Solo donde siga sin foto: lo que el
-- Parque haya subido desde el panel no se toca. Los nombres se buscan por
-- prefijo para no depender de acentos ni de la raya larga que llevan dos de
-- ellos.

UPDATE "DestacadoInicio" SET "imagenUrl" = '/images/galeria/cibao-futbol-club.jpg', "updatedAt" = NOW()
WHERE "titulo" LIKE 'Cibao F%' AND COALESCE("imagenUrl", '') = '';

UPDATE "DestacadoInicio" SET "imagenUrl" = '/images/galeria/cancha-tenis.jpg', "updatedAt" = NOW()
WHERE "titulo" LIKE 'Escuela de Tenis%' AND COALESCE("imagenUrl", '') = '';

UPDATE "DestacadoInicio" SET "imagenUrl" = '/images/galeria/funstop.jpg', "updatedAt" = NOW()
WHERE "titulo" LIKE 'Fun Stop%' AND COALESCE("imagenUrl", '') = '';

UPDATE "DestacadoInicio" SET "imagenUrl" = '/images/galeria/ciclistas.jpg', "updatedAt" = NOW()
WHERE "titulo" LIKE 'Alquiler de Bicicletas%' AND COALESCE("imagenUrl", '') = '';
