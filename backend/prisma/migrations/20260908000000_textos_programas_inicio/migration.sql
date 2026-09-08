-- El rotulo y el titulo del bloque de Programas y Proyectos de la portada eran
-- los dos unicos de esa pagina escritos en el codigo: todos los demas ya se
-- editaban desde el panel. Se agregan como textos para que el Parque los pueda
-- cambiar sin pedirnoslo.
--
-- Se insertan en el grupo "Titulos del inicio" en la posicion que ocupan en la
-- pagina —entre "Quienes somos" y "Mapa"— y por eso los del mapa se corren dos
-- puestos: en el panel la lista se lee en el mismo orden en que se ve el sitio.
--
-- ON CONFLICT DO NOTHING para que volver a aplicarla sobre una base que ya los
-- tenga no falle ni pise lo que el Parque haya escrito.

UPDATE "Texto" SET "orden" = "orden" + 2
WHERE "grupo" = 'Títulos del inicio' AND "orden" >= 9;

INSERT INTO "Texto" ("clave", "etiqueta", "grupo", "valor", "multiline", "ayuda", "orden", "updatedAt")
VALUES
  ('inicio.programasEtiqueta', 'Programas — etiqueta', 'Títulos del inicio', 'En desarrollo', false,
   'Texto pequeño en verde sobre el título del bloque de programas de la portada.', 9, NOW()),
  ('inicio.programasTitulo', 'Programas — título', 'Títulos del inicio', 'Programas y Proyectos', false,
   'Título del bloque de programas de la portada.', 10, NOW())
ON CONFLICT ("clave") DO NOTHING;
