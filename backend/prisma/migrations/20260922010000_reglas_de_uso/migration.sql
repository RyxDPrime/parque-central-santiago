-- Las reglas de uso pasan a ser datos administrables.
--
-- El documento "Solicitud y condiciones para el uso de espacios" trae ocho
-- bloques de condiciones generales y un puñado de reglas propias de cada
-- trámite. Hasta ahora nada de eso estaba en el sistema: quien solicitaba no
-- veía las condiciones por ningún lado, y el Parque no tenía dónde cambiarlas.
--
-- Se cargan aquí para que se vean en dos sitios: dentro del formulario, solo
-- las que aplican a lo que la persona eligió, y completas en la página de
-- Condiciones de uso.

ALTER TABLE "TipoActividad" ADD COLUMN IF NOT EXISTS "datosPedidos" TEXT;
ALTER TABLE "SolicitudReserva" ADD COLUMN IF NOT EXISTS "montajeFecha" TEXT;
ALTER TABLE "SolicitudReserva" ADD COLUMN IF NOT EXISTS "montajeHora" TEXT;
ALTER TABLE "SolicitudReserva" ADD COLUMN IF NOT EXISTS "desmontajeFecha" TEXT;
ALTER TABLE "SolicitudReserva" ADD COLUMN IF NOT EXISTS "desmontajeHora" TEXT;
ALTER TABLE "SolicitudReserva" ADD COLUMN IF NOT EXISTS "aceptoCondiciones" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "ReglaUso" (
  "id" SERIAL NOT NULL,
  "ambito" TEXT NOT NULL DEFAULT 'general',
  "aplicaA" TEXT,
  "grupo" TEXT NOT NULL,
  "texto" TEXT NOT NULL,
  "tipo" TEXT NOT NULL DEFAULT 'requisito',
  "activa" BOOLEAN NOT NULL DEFAULT true,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReglaUso_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ReglaUso_ambito_aplicaA_idx" ON "ReglaUso"("ambito", "aplicaA");

-- Qué datos pide cada trámite. Se le muestra a quien solicita encima del campo
-- de descripción, para que no haya que pedírselos después por correo.
UPDATE "TipoActividad" SET "datosPedidos" = 'Nombre de quien reserva, cédula, teléfono, kiosco que desea usar y día solicitado.'
  WHERE "nombre" = 'Alquiler de kiosco';
UPDATE "TipoActividad" SET "datosPedidos" = 'Tipo de montaje que requiere, y fecha y horario de montaje y desmontaje.'
  WHERE "nombre" = 'Evento o actividad en general';
UPDATE "TipoActividad" SET "datosPedidos" = 'Nombre del bazar, cantidad de mesas que se instalarán, cantidad aproximada de expositores, tipo de productos o servicios que se ofrecerán, y si habrá venta de alimentos, música o animación, o algún costo de entrada al público.'
  WHERE "nombre" = 'Bazar o feria';
UPDATE "TipoActividad" SET "datosPedidos" = 'Nombre y dirección de la escuela, hora de llegada y de salida, cantidad aproximada de estudiantes, y nombre, cédula y teléfono del responsable de la excursión.'
  WHERE "nombre" = 'Visita escolar';
UPDATE "TipoActividad" SET "datosPedidos" = 'Nombre de la actividad si lo tiene, si será gratuita o tendrá costo para los participantes, y si usará música, bocinas, micrófonos, carpas, mesas, sillas u otras estructuras.'
  WHERE "nombre" = 'Actividad deportiva';
UPDATE "TipoActividad" SET "datosPedidos" = 'Si es sesión de fotos, grabación de video o práctica de vuelo de dron, y en el caso del dron, el tipo de equipo que se utilizará.'
  WHERE "nombre" = 'Sesión de fotos, video o dron';
UPDATE "TipoActividad" SET "datosPedidos" = 'Nombre de la escuela o institución, horario de estudio, y los días en los que se realizarán las horas.'
  WHERE "nombre" = '30 horas de servicio';

INSERT INTO "ReglaUso" ("ambito","aplicaA","grupo","texto","tipo","orden","updatedAt") VALUES
-- ── Generales: responsabilidad ──
('general', NULL, 'Responsabilidad del usuario', 'Velar por el buen uso del espacio asignado.', 'requisito', 1, NOW()),
('general', NULL, 'Responsabilidad del usuario', 'Mantener y entregar el área utilizada en las mismas condiciones en que fue recibida.', 'requisito', 2, NOW()),
('general', NULL, 'Responsabilidad del usuario', 'Responder por cualquier daño ocasionado a las instalaciones, árboles, áreas verdes, mobiliario o demás bienes del Parque.', 'requisito', 3, NOW()),
('general', NULL, 'Responsabilidad del usuario', 'Cumplir las indicaciones del personal de Administración y Seguridad del Parque.', 'requisito', 4, NOW()),
('general', NULL, 'Responsabilidad del usuario', 'Garantizar el adecuado manejo de sus equipos, materiales y pertenencias.', 'requisito', 5, NOW()),
('general', NULL, 'Responsabilidad del usuario', 'Asumir la responsabilidad por las actuaciones de empleados, contratistas, proveedores, participantes e invitados relacionados con la actividad.', 'requisito', 6, NOW()),
('general', NULL, 'Responsabilidad del usuario', 'El Patronato no responde por robos, pérdidas o daños de vehículos, mercancías, equipos u objetos dejados en el Parque antes, durante o después de la actividad.', 'requisito', 7, NOW()),

-- ── Generales: montaje ──
('general', NULL, 'Montaje y desmontaje', 'Todo montaje, instalación y desmontaje debe realizarse dentro de los días y horarios previamente autorizados.', 'requisito', 10, NOW()),
('general', NULL, 'Montaje y desmontaje', 'Las estructuras o equipos especiales —carpas, tarimas, barreras, iluminación, amplificación, servicios sanitarios, equipos eléctricos, seguridad— los gestiona el responsable de la actividad, coordinados previamente con la Administración.', 'requisito', 11, NOW()),
('general', NULL, 'Montaje y desmontaje', 'El usuario asume los costos de los elementos que requiera su actividad, cuando corresponda.', 'requisito', 12, NOW()),

-- ── Generales: electricidad ──
('general', NULL, 'Energía eléctrica', 'Los espacios del Parque no cuentan con servicio de energía eléctrica incluido para las actividades.', 'requisito', 20, NOW()),
('general', NULL, 'Energía eléctrica', 'Cuando la actividad requiera suministro eléctrico, el responsable debe contratarlo y facturarlo directamente con Edenorte.', 'requisito', 21, NOW()),
('general', NULL, 'Energía eléctrica', 'En las áreas al aire libre, la electricidad la provee el usuario con su propia planta eléctrica.', 'requisito', 22, NOW()),
('general', NULL, 'Energía eléctrica', 'No está permitido realizar conexiones a las redes eléctricas del Patronato o de APEDI.', 'prohibido', 23, NOW()),

-- ── Generales: publicidad ──
('general', NULL, 'Publicidad y promoción', 'No está permitida la colocación de publicidad en postes del tendido eléctrico, verjas, árboles, edificaciones u otros lugares no autorizados.', 'prohibido', 30, NOW()),
('general', NULL, 'Publicidad y promoción', 'Cualquier elemento publicitario debe coordinarse previamente y colocarse solo en los espacios establecidos para ello.', 'requisito', 31, NOW()),
('general', NULL, 'Publicidad y promoción', 'Está prohibido colocar flyers o material promocional dentro del Parque antes del evento, salvo autorización previa.', 'prohibido', 32, NOW()),

-- ── Generales: seguridad ──
('general', NULL, 'Seguridad y restricciones', 'Prohibido el uso de armas de fuego o armas blancas, salvo el personal de seguridad autorizado.', 'prohibido', 40, NOW()),
('general', NULL, 'Seguridad y restricciones', 'Prohibido el uso de fuegos artificiales sin autorización previa y supervisión especializada.', 'prohibido', 41, NOW()),
('general', NULL, 'Seguridad y restricciones', 'Prohibido realizar perforaciones en áreas asfaltadas.', 'prohibido', 42, NOW()),
('general', NULL, 'Seguridad y restricciones', 'Prohibidas las actividades ilícitas o que alteren el orden público.', 'prohibido', 43, NOW()),
('general', NULL, 'Seguridad y restricciones', 'Prohibidas las actividades contrarias a las normas de convivencia, seguridad y buenas costumbres.', 'prohibido', 44, NOW()),
('general', NULL, 'Seguridad y restricciones', 'El Patronato puede detener o dar por terminada la actividad, previa notificación, cuando se incumplan las normas, se altere el orden o se ponga en riesgo la seguridad. Puede solicitar el apoyo de la fuerza pública cuando sea necesario.', 'requisito', 45, NOW()),

-- ── Generales: permisos ──
('general', NULL, 'Permisos adicionales', 'Según la naturaleza de la actividad, el responsable debe gestionar los permisos que correspondan: publicidad exterior, espectáculos públicos, extensión de horario, expendio de bebidas alcohólicas, SGACEDOM u otros.', 'requisito', 50, NOW()),
('general', NULL, 'Permisos adicionales', 'Cuando apliquen, estos documentos deben presentarse al Parque antes del inicio del montaje.', 'requisito', 51, NOW()),
('general', NULL, 'Permisos adicionales', 'Para determinadas actividades, la Administración puede requerir condiciones adicionales: seguros, personal de seguridad, permisos especiales u otros requisitos. Se informan durante la evaluación de la solicitud.', 'requisito', 52, NOW()),

-- ── Generales: pago ──
('general', NULL, 'Aportes y pago', 'El costo depende del área solicitada, el tipo de actividad, la duración, la cantidad de personas, el montaje y demás condiciones. La Administración lo informa una vez evaluada la actividad.', 'requisito', 60, NOW()),
('general', NULL, 'Aportes y pago', 'El pago debe realizarse aproximadamente tres semanas antes de la fecha de la actividad. Si no se realiza en ese plazo, el Patronato puede cancelar la actividad y liberar la fecha.', 'requisito', 61, NOW()),
('general', NULL, 'Aportes y pago', 'En caso de cancelación se retiene como penalidad el cincuenta por ciento (50%) del monto adelantado. En determinados casos puede acordarse una nueva fecha, sujeta a disponibilidad.', 'requisito', 62, NOW()),
('general', NULL, 'Aportes y pago', 'El aporte puede realizarse de lunes a viernes, de 8:30 a.m. a 4:30 p.m., en las oficinas administrativas dentro del Parque.', 'permitido', 63, NOW()),

-- ── Por trámite ──
('tramite', 'Alquiler de kiosco', 'Reglas del kiosco', 'Se permite colocar cualquier tipo de decoración.', 'permitido', 1, NOW()),
('tramite', 'Alquiler de kiosco', 'Reglas del kiosco', 'Se permite música a volumen moderado.', 'permitido', 2, NOW()),
('tramite', 'Alquiler de kiosco', 'Reglas del kiosco', 'No está permitido clavar, perforar ni dañar la estructura del kiosco.', 'prohibido', 3, NOW()),
('tramite', 'Alquiler de kiosco', 'Reglas del kiosco', 'No están permitidas las bebidas alcohólicas.', 'prohibido', 4, NOW()),
('tramite', 'Alquiler de kiosco', 'Reglas del kiosco', 'Los juegos inflables se permiten en el resto del parque, siempre que el solicitante lleve su propia planta eléctrica. En el Área Infantil no se permiten.', 'requisito', 5, NOW()),

('tramite', 'Bazar o feria', 'Reglas del bazar', 'Se requiere un mínimo de 10 mesas.', 'requisito', 1, NOW()),
('tramite', 'Bazar o feria', 'Reglas del bazar', 'Si hay música, presentaciones artísticas o contenido sujeto a derechos de autor, el organizador debe presentar el permiso de SGACEDOM con al menos una semana de anticipación. Contacto: Nelsi Pérez, 809-570-5544 / 849-460-4528, nelsiperez@sgacedom.org', 'requisito', 2, NOW()),
('tramite', 'Bazar o feria', 'Reglas del bazar', 'El usuario debe respetar las vías de circulación y las áreas de uso general del Parque.', 'requisito', 3, NOW()),

('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'Por cada 20 niños debe haber al menos un adulto responsable.', 'requisito', 1, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'Los estudiantes deben permanecer bajo supervisión constante durante toda la visita.', 'requisito', 2, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'El área infantil es exclusiva para niños de hasta 12 años. Los maestros y adultos responsables no deben subirse a los juegos infantiles.', 'prohibido', 3, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'No está permitido el uso del gimnasio al aire libre.', 'prohibido', 4, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'No se permite la venta de alimentos entre la institución y los estudiantes dentro del parque. Los refrigerios deben permanecer en el transporte.', 'prohibido', 5, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'No se permiten BBQ ni actividades que impliquen cocinar.', 'prohibido', 6, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'Prohibido ingresar botellas de vidrio u objetos punzantes.', 'prohibido', 7, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'Se recomienda dejar mochilas y objetos personales dentro del transporte.', 'requisito', 8, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'El área de Buddy Bear debe utilizarse únicamente bajo supervisión. Cualquier daño será responsabilidad de la institución.', 'requisito', 9, NOW()),
('tramite', 'Visita escolar', 'Reglas de la visita escolar', 'El uso del play, las canchas de tenis o el campo de fútbol se solicita aparte: indícalo al hacer la solicitud para que te expliquen los pasos.', 'requisito', 10, NOW()),

('tramite', 'Actividad deportiva', 'Reglas de la actividad deportiva', 'La actividad debe realizarse dentro del horario previamente autorizado.', 'requisito', 1, NOW()),
('tramite', 'Actividad deportiva', 'Reglas de la actividad deportiva', 'El organizador mantiene el orden y la limpieza durante y después de la actividad.', 'requisito', 2, NOW()),
('tramite', 'Actividad deportiva', 'Reglas de la actividad deportiva', 'Todo equipo, estructura o material debe retirarse al finalizar.', 'requisito', 3, NOW()),
('tramite', 'Actividad deportiva', 'Reglas de la actividad deportiva', 'Con equipos eléctricos al aire libre, el organizador debe llevar su propia planta eléctrica.', 'requisito', 4, NOW()),
('tramite', 'Actividad deportiva', 'Reglas de la actividad deportiva', 'No se permite cocinar ni realizar actividades que impliquen fuego, salvo autorización previa.', 'prohibido', 5, NOW()),

('tramite', 'Sesión de fotos, video o dron', 'Reglas de la sesión', 'No está permitida la entrada de vehículos al Parque para realizar sesiones o grabaciones.', 'prohibido', 1, NOW()),
('tramite', 'Sesión de fotos, video o dron', 'Reglas de la sesión', 'No se permite el uso de fuegos artificiales ni de herramientas o equipos que representen un riesgo.', 'prohibido', 2, NOW()),
('tramite', 'Sesión de fotos, video o dron', 'Reglas de la sesión', 'Las sesiones deben respetar a los demás usuarios y no obstruir las áreas de circulación.', 'requisito', 3, NOW()),
('tramite', 'Sesión de fotos, video o dron', 'Reglas de la sesión', 'Se debe usar vestimenta adecuada: el Parque es un espacio de esparcimiento familiar.', 'requisito', 4, NOW()),
('tramite', 'Sesión de fotos, video o dron', 'Reglas de la sesión', 'El uso de drones debe ser responsable y seguro, cumpliendo las normativas aplicables. No se permitirá si representa un riesgo para los visitantes o las instalaciones.', 'requisito', 5, NOW()),
('tramite', 'Sesión de fotos, video o dron', 'Reglas de la sesión', 'La autorización no implica ocupar áreas de manera exclusiva ni interferir con las actividades habituales del Parque.', 'requisito', 6, NOW()),

('tramite', '30 horas de servicio', 'Reglas de las 30 horas', 'Horario único: lunes a viernes, de 7:00 a.m. a 3:00 p.m.', 'requisito', 1, NOW()),
('tramite', '30 horas de servicio', 'Reglas de las 30 horas', 'El mínimo requerido por grupo es de 10 personas.', 'requisito', 2, NOW()),
('tramite', '30 horas de servicio', 'Reglas de las 30 horas', 'Las 30 horas se completan en 5 días, a razón de 6 horas por día.', 'requisito', 3, NOW()),
('tramite', '30 horas de servicio', 'Reglas de las 30 horas', 'Los días se coordinan previamente con la administración del Parque.', 'requisito', 4, NOW()),

-- ── Por espacio ──
('espacio', 'Área de picnic', 'Reglas del área de picnic', 'Las celebraciones que usen solo las mesas de madera no requieren autorización: funcionan por orden de llegada.', 'permitido', 1, NOW()),
('espacio', 'Área de picnic', 'Reglas del área de picnic', 'Se pueden llevar pasteles, globos, decoración sencilla y los utensilios necesarios.', 'permitido', 2, NOW()),
('espacio', 'Área de picnic', 'Reglas del área de picnic', 'No está permitido ingresar sillas ni mesas plásticas sin autorización previa.', 'prohibido', 3, NOW()),
('espacio', 'Área de picnic', 'Reglas del área de picnic', 'No se permiten montajes ni decoraciones estructuradas sin autorización previa.', 'prohibido', 4, NOW()),
('espacio', 'Área de picnic', 'Reglas del área de picnic', 'Las celebraciones de más de 20 personas requieren autorización con anticipación.', 'requisito', 5, NOW()),

('espacio', 'Kiosco del Área Infantil', 'Reglas de este kiosco', 'No se permiten juegos inflables dentro del Área Infantil.', 'prohibido', 1, NOW()),
('espacio', 'Kiosco del Área Infantil', 'Reglas de este kiosco', 'El área infantil es exclusiva para niños de hasta 12 años.', 'requisito', 2, NOW()),

('espacio', 'Cancha de voleibol', 'Reglas de la cancha', 'De uso gratuito fuera de los horarios de práctica juvenil: lunes a jueves, de 4:45 p.m. a 6:15 p.m.', 'permitido', 1, NOW()),

('espacio', 'Área al aire libre', 'Reglas de este espacio', 'La electricidad la provee el usuario con su propia planta eléctrica.', 'requisito', 1, NOW());
