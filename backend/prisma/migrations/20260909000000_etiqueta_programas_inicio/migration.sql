-- El rotulo verde sobre "Programas y Servicios" en la portada decia "En
-- desarrollo". Nombraba lo que en su momento hubo debajo —proyectos en los que
-- se estaba trabajando— pero el bloque hoy es otra cosa: una seleccion de lo
-- que el parque ya ofrece, con un boton que lleva al listado completo. El
-- rotulo contaba una cosa y el contenido otra.
--
-- Se cambia solo si sigue diciendo lo de antes: si el Parque ya lo escribio a
-- su gusto desde el panel, esta migracion no lo pisa. Y como el texto vive en
-- la base, seguira siendo editable desde Pagina de inicio -> Titulos.

UPDATE "Texto"
SET "valor" = 'Lo que ofrecemos', "updatedAt" = NOW()
WHERE "clave" = 'inicio.programasEtiqueta' AND "valor" = 'En desarrollo';
