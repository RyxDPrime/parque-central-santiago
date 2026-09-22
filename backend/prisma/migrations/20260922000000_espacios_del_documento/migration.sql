-- Los espacios y tipos de actividad pasan a ser los del documento del Parque.
--
-- Lo que habia era un borrador nuestro, puesto para tener algo que mostrar
-- mientras se construia: doce espacios inventados, con capacidades supuestas y
-- sin un solo aporte. El Parque nunca instruyo que esos fueran los espacios
-- reservables. El 22 de septiembre entrego "Solicitud y condiciones para el uso
-- de espacios", y esta migracion reemplaza el borrador por lo que ese documento
-- dice.
--
-- Tres cambios de fondo respecto del borrador:
--
--   1. Los kioscos tienen nombre propio. Eran "kiosco pequeno" y "kiosco
--      grande"; son cinco, y quien solicita pide uno por su nombre.
--   2. Hay espacios que el Parque no reserva. Las canchas de tenis, el campo de
--      futbol y el Disc Golf los gestionan operadores externos. Aceptarle una
--      solicitud a alguien por un espacio que el Parque no puede aprobar es
--      hacerle perder tres dias; ahora el sitio lo manda al contacto que
--      corresponde.
--   3. El area de picnic no se reserva hasta veinte personas: funciona por
--      orden de llegada. Estaba como reservable siempre.

ALTER TABLE "EspacioReservable" ADD COLUMN IF NOT EXISTS "aporte" TEXT;
ALTER TABLE "EspacioReservable" ADD COLUMN IF NOT EXISTS "gestion" TEXT NOT NULL DEFAULT 'parque';
ALTER TABLE "EspacioReservable" ADD COLUMN IF NOT EXISTS "contacto" TEXT;

-- Se vacian las dos listas: no hay nada que conservar, porque ninguna fila
-- salio del Parque. Las solicitudes ya recibidas no se tocan: guardan el
-- espacio y el tipo como texto, no como referencia.
DELETE FROM "EspacioReservable";
DELETE FROM "TipoActividad";

INSERT INTO "EspacioReservable"
  ("nombre","descripcion","cantidad","capacidad","requierePago","aporte","gestion","contacto","activo","orden","updatedAt")
VALUES
  ('Kiosco La Mara',
   'Kiosco techado con mesas, para celebraciones y compartir familiar. Se permite decoración y música a volumen moderado. No se permite clavar ni perforar la estructura, ni bebidas alcohólicas.',
   NULL, NULL, true, 'RD$2,000.00 por el día completo', 'parque', NULL, true, 1, NOW()),
  ('Kiosco del Área Infantil',
   'Kiosco junto al área infantil. Además de las condiciones generales de los kioscos, aquí no se permiten juegos inflables. El área infantil es para niños de hasta 12 años.',
   NULL, NULL, true, 'RD$2,000.00 por el día completo', 'parque', NULL, true, 2, NOW()),
  ('Kiosco El Samán',
   'Kiosco techado con mesas, para celebraciones y compartir familiar. Se permite decoración y música a volumen moderado. No se permite clavar ni perforar la estructura, ni bebidas alcohólicas.',
   NULL, NULL, true, 'RD$2,000.00 por el día completo', 'parque', NULL, true, 3, NOW()),
  ('Kiosco Las Andirobas',
   'Kiosco techado con mesas, para celebraciones y compartir familiar. Se permite decoración y música a volumen moderado. No se permite clavar ni perforar la estructura, ni bebidas alcohólicas.',
   NULL, NULL, true, 'RD$2,000.00 por el día completo', 'parque', NULL, true, 4, NOW()),
  ('Kiosco Los Robles',
   'Kiosco techado con mesas, para celebraciones y compartir familiar. Se permite decoración y música a volumen moderado. No se permite clavar ni perforar la estructura, ni bebidas alcohólicas.',
   NULL, NULL, true, 'RD$2,000.00 por el día completo', 'parque', NULL, true, 5, NOW()),
  ('Área al aire libre',
   'Espacio abierto para bazares, ferias y actividades de mayor magnitud. La electricidad la provee el solicitante con su propia planta: el Parque no incluye servicio eléctrico. Para un bazar se requiere un mínimo de 10 mesas.',
   NULL, NULL, true, 'RD$7,500.00 por día', 'parque', NULL, true, 6, NOW()),
  ('Hangar',
   'Espacio techado para bazares, ferias y actividades bajo techo. Para un bazar se requiere un mínimo de 10 mesas.',
   NULL, NULL, true, 'RD$12,000.00 por día', 'parque', NULL, true, 7, NOW()),
  ('Área de picnic',
   'Mesas de madera para celebraciones sencillas. Hasta 20 personas NO requiere autorización: funciona por orden de llegada. Se pueden llevar pasteles, globos, decoración sencilla y utensilios. No se permiten sillas ni mesas plásticas, ni montajes o decoraciones estructuradas, sin autorización previa.',
   NULL, 20, false, NULL, 'libre',
   'Para celebraciones de más de 20 personas, o que requieran mobiliario, montaje o decoración especial, solicite autorización previa a la administración: 809-583-9581.',
   true, 8, NOW()),
  ('Canchas de tenis',
   'Funcionan mediante reservación, gestionada por su operador.',
   NULL, NULL, false, NULL, 'tercero',
   'Reserve con Jeudy al (829) 468-0617, por WhatsApp con Eligio Reynoso al 347-886-1122, o en línea en yourcourts.com (código de acceso 269991).',
   true, 9, NOW()),
  ('Campo de fútbol',
   'Funciona mediante reservación, gestionada por su operador.',
   NULL, NULL, false, NULL, 'tercero',
   'Para reservas individuales, comuníquese con Juan Carlos al 809-519-1570. Para clases guiadas, con la Academia de Fútbol Santiago al 809-856-1666.',
   true, 10, NOW()),
  ('Área de Disc Golf',
   'Funciona mediante reservación, gestionada por su operador.',
   NULL, NULL, false, NULL, 'tercero',
   'Información sobre grupos, discos y reservas al 809-982-3715, o con @ChainLinkDiscGolf en redes sociales.',
   true, 11, NOW()),
  ('Cancha de voleibol',
   'De uso gratuito para el público fuera de los horarios de práctica juvenil: lunes a jueves, de 4:45 p.m. a 6:15 p.m.',
   NULL, NULL, false, NULL, 'libre',
   'Para recibir prácticas, comuníquese con Bears Sports Club al 849-515-5988.',
   true, 12, NOW());

-- Los tipos de actividad pasan a ser los tramites del documento: cada uno pide
-- datos distintos y tiene sus propias condiciones, que es justo lo que hay que
-- saber antes de aceptar una solicitud.
INSERT INTO "TipoActividad" ("nombre","permitido","nota","orden","updatedAt")
VALUES
  ('Alquiler de kiosco', true,
   'Aporte de RD$2,000.00 por el día completo. Se permite decoración y música a volumen moderado; no se permite clavar la estructura ni bebidas alcohólicas.', 1, NOW()),
  ('Evento o actividad en general', true,
   'El aporte depende del área, el tipo de actividad, la duración, la cantidad de personas y el montaje. La administración lo informa al evaluar la solicitud.', 2, NOW()),
  ('Bazar o feria', true,
   'Área al aire libre RD$7,500.00 por día; Hangar RD$12,000.00 por día. Mínimo 10 mesas. Si hay música o presentaciones artísticas, se requiere el permiso de SGACEDOM con una semana de anticipación.', 3, NOW()),
  ('Visita escolar', true,
   'Hasta 100 estudiantes: RD$1,500.00. De 200 a 300 o más: entre RD$2,000.00 y RD$2,500.00 por la excursión completa. Un adulto responsable por cada 20 niños.', 4, NOW()),
  ('Actividad deportiva', true,
   'Si usa equipos eléctricos al aire libre, el organizador debe llevar su propia planta eléctrica. Todo equipo o estructura debe retirarse al finalizar.', 5, NOW()),
  ('Sesión de fotos, video o dron', true,
   'No se permite la entrada de vehículos para la sesión. El uso de dron debe cumplir las normativas aplicables y no poner en riesgo a los visitantes.', 6, NOW()),
  ('30 horas de servicio', true,
   'Horario unico: lunes a viernes de 7:00 a.m. a 3:00 p.m. Mínimo 10 personas por grupo. Se completan en 5 días, a razón de 6 horas por día.', 7, NOW()),
  ('Venta individual de productos', false,
   'No está permitida la venta individual dentro del Parque. Quien quiera comercializar puede participar en las Ferias de Emprendedores: consulte el calendario en @parquecentralsantiago o llame al 809-583-9581.', 8, NOW());
