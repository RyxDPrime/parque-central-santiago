// Contenido que antes estaba escrito dentro de las páginas y ahora vive en la
// base de datos. Se ejecuta con `npm run seed:contenido` y solo inserta lo que
// falta, así no pisa lo que el Parque ya haya editado desde el panel.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hitos = [
  {
    fecha: "20 feb 2018",
    titulo: "Inauguración del parque",
    texto:
      "Tras casi dos décadas de gestiones de la Asociación para el Desarrollo, Inc. (APEDI) junto a instituciones públicas y privadas de la región, el Parque Central de Santiago abre sus puertas a la comunidad.",
  },
  {
    fecha: "6 abr 2018",
    titulo: "Constitución del Patronato",
    texto:
      "Queda formalmente constituido el Patronato para la Administración del Parque Central de Santiago, la entidad sin fines de lucro responsable de su gestión, administración y desarrollo.",
  },
];

const normas = [
  { icono: "ti-tree", titulo: "Cuida las áreas verdes", texto: "Respeta y cuida las áreas verdes, jardines y demás espacios naturales del parque." },
  { icono: "ti-feather", titulo: "Protege la flora y fauna", texto: "Evita dañar las plantas o molestar, alimentar o perseguir a los animales que habitan en el parque." },
  { icono: "ti-trash", titulo: "Mantén el parque limpio", texto: "Deposita la basura en los recipientes destinados para ello, o recógela si la encuentras en el suelo." },
  { icono: "ti-paw", titulo: "Responsabilidad con mascotas", texto: "Los propietarios de mascotas son responsables de recoger y disponer adecuadamente de sus desechos." },
  { icono: "ti-ban", titulo: "Sin alcohol ni sustancias ilícitas", texto: "Está prohibido el ingreso y consumo de bebidas alcohólicas, sustancias estupefacientes o cualquier otra sustancia ilícita." },
  { icono: "ti-shield-x", titulo: "Sin armas", texto: "No se permite el ingreso de armas de fuego, blancas ni objetos que puedan poner en riesgo la seguridad." },
  { icono: "ti-flame-off", titulo: "Cuidado con el fuego", texto: "No se permite hacer fogatas ni utilizar fuego en áreas no autorizadas." },
  { icono: "ti-users", titulo: "Respeta a los demás visitantes", texto: "Mantén un comportamiento respetuoso con las demás personas que disfrutan del parque." },
  { icono: "ti-heart-handshake", titulo: "Cuida el mobiliario", texto: "Utiliza adecuadamente los bancos, kioscos, juegos y demás instalaciones del parque." },
  { icono: "ti-volume", titulo: "Controla el volumen", texto: "Evita el uso de equipos de sonido a volumen alto que puedan incomodar a otros visitantes." },
  { icono: "ti-info-circle", titulo: "Sigue las indicaciones", texto: "Atiende las indicaciones del personal del parque y la señalización de cada área." },
  { icono: "ti-alert-triangle", titulo: "Reporta incidentes", texto: "Informa al personal del parque cualquier situación de riesgo, daño o emergencia." },
];

const pasosReserva = [
  { icono: "ti-calendar-search", titulo: "Consulta disponibilidad", texto: "Revisa el calendario de actividades del parque para confirmar que la fecha que buscas esté libre." },
  { icono: "ti-message-2", titulo: "Contáctanos", texto: "Escríbenos por teléfono, WhatsApp o el formulario de contacto indicando fecha, espacio y tipo de actividad." },
  { icono: "ti-checkbox", titulo: "Coordinación final", texto: "El equipo del parque confirma la reserva y coordina contigo los detalles logísticos necesarios." },
];

const formasApoyo = [
  { icono: "ti-hand-heart", etiqueta: "Voluntariado", titulo: "Ser voluntario", texto: "Súmate a las jornadas de mantenimiento, educación ambiental y actividades comunitarias. El Parque firma las horas de servicio ambiental que exigen los centros educativos a sus estudiantes." },
  { icono: "ti-coin", etiqueta: "Donaciones", titulo: "Hacer una donación", texto: "Tu aporte ayuda a mantener las instalaciones y los programas del parque. Próximamente habilitaremos donaciones en línea." },
];

const cifras = [
  { numero: "2 campos", descripcion: "Dos campos de fútbol reglamentarios, además de canchas de baloncesto, tenis, voleibol y disc golf para toda la comunidad.", imagenUrl: "/images/galeria/campo-futbol.jpg", etiqueta: "Complejo Deportivo", enlaceTexto: "Ver instalaciones y servicios", enlaceUrl: "/instalaciones-y-servicios" },
  { numero: "17", descripcion: "Instituciones públicas y privadas conforman la Junta Directiva del Patronato para la Administración del Parque Central de Santiago.", imagenUrl: "/images/galeria/entrada-parque.jpg", etiqueta: "Patronato PCS", enlaceTexto: "Conoce la Junta Directiva", enlaceUrl: "/junta-directiva" },
  { numero: "32 kioscos", descripcion: "8 grandes y 24 pequeños para reuniones familiares.", imagenUrl: "/images/galeria/gimnasio-aire-libre.jpg", etiqueta: "Áreas de Picnic", enlaceTexto: null, enlaceUrl: null },
  { numero: "450", descripcion: "Espacios de estacionamiento para los visitantes.", imagenUrl: "/images/galeria/voleibol.jpg", etiqueta: "Parqueos", enlaceTexto: null, enlaceUrl: null },
  { numero: "2018", descripcion: "Año de inauguración del parque, resultado de casi dos décadas de gestión de la Asociación para el Desarrollo, Inc. (APEDI).", imagenUrl: "/images/galeria/cancha-tenis.jpg", etiqueta: "Desde 2018", enlaceTexto: "Conoce nuestra historia", enlaceUrl: "/sobre-el-parque" },
];

const encabezados = [
  { clave: "inicio", etiqueta: "Inicio (portada)", imagenUrl: "/images/galeria/vista-aerea-parque.jpg", posicion: "center", orden: 1 },
  { clave: "sobre-el-parque", etiqueta: "Historia", imagenUrl: "/images/galeria/entrada-parque.jpg", posicion: "center", orden: 2 },
  { clave: "reglamento", etiqueta: "Reglamento", imagenUrl: "/images/galeria/vista-aerea-parque.jpg", posicion: "center", orden: 3 },
  { clave: "junta-directiva", etiqueta: "Junta Directiva", imagenUrl: "/images/galeria/vista-aerea-parque.jpg", posicion: "center", orden: 4 },
  { clave: "personal-tecnico", etiqueta: "Personal Tecnico", imagenUrl: "/images/galeria/entrada-parque.jpg", posicion: "center", orden: 5 },
  { clave: "transparencia", etiqueta: "Transparencia", imagenUrl: "/images/galeria/entrada-parque.jpg", posicion: "center", orden: 6 },
  { clave: "instalaciones-y-servicios", etiqueta: "Instalaciones y Servicios", imagenUrl: "/images/galeria/cancha-basketball.jpg", posicion: "center", orden: 7 },
  { clave: "programas-y-proyectos", etiqueta: "Programas y Proyectos", imagenUrl: "/images/galeria/cibao-futbol-club.jpg", posicion: "center", orden: 8 },
  { clave: "galeria", etiqueta: "Galeria", imagenUrl: "/images/galeria/parque-infantil.jpg", posicion: "center", orden: 9 },
  { clave: "mapa", etiqueta: "Mapa del Parque", imagenUrl: "/images/galeria/vista-aerea-parque.jpg", posicion: "center", orden: 10 },
  { clave: "actividades", etiqueta: "Actividades", imagenUrl: "/images/galeria/maraton-5k.jpg", posicion: "center", orden: 11 },
  { clave: "reserva", etiqueta: "Reserva", imagenUrl: "/images/galeria/navidad-en-el-parque.jpg", posicion: "center", orden: 12 },
  { clave: "blog", etiqueta: "Blog", imagenUrl: "/images/galeria/dia-del-yoga.jpg", posicion: "center 26%", orden: 13 },
  { clave: "apoyanos", etiqueta: "Apoyanos", imagenUrl: "/images/galeria/ciclistas.jpg", posicion: "center", orden: 14 },
  { clave: "contacto", etiqueta: "Contacto", imagenUrl: "/images/galeria/gimnasio-aire-libre.jpg", posicion: "center", orden: 15 },
  { clave: "no-encontrada", etiqueta: "Pagina no encontrada", imagenUrl: "/images/galeria/vista-aerea-parque.jpg", posicion: "center", orden: 16 },
];

const textos = [
  { clave: "contacto.direccion", etiqueta: "Dirección", grupo: "Contacto", valor: "Av. Bartolomé Colón esq. Padre Las Casas, Santiago de los Caballeros", orden: 1 },
  { clave: "contacto.email", etiqueta: "Correo electrónico", grupo: "Contacto", valor: "asistentepcs@gmail.com", orden: 2 },
  { clave: "contacto.telefono", etiqueta: "Teléfono", grupo: "Contacto", valor: "(809) 583-9581", orden: 3 },
  { clave: "contacto.whatsapp", etiqueta: "WhatsApp", grupo: "Contacto", valor: "(849) 580-7344", orden: 4 },
  { clave: "contacto.horarioParque", etiqueta: "Horario del parque", grupo: "Contacto", valor: "5:30 a.m. – 9:00 p.m.", orden: 5 },
  { clave: "contacto.horarioOficina", etiqueta: "Horario de oficina", grupo: "Contacto", valor: "lun–vie 8:30 a.m. – 5:00 p.m.", orden: 6 },

  { clave: "inicio.heroTitulo", etiqueta: "Título principal", grupo: "Inicio", valor: "El pulmón verde de Santiago", orden: 1 },
  { clave: "inicio.heroTexto", etiqueta: "Texto principal", grupo: "Inicio", valor: "Un espacio para la recreación, el deporte, la cultura y la convivencia ciudadana, administrado por el Patronato para la Administración del Parque Central de Santiago desde 2018.", multiline: true, orden: 2 },

  { clave: "inicio.cifrasEtiqueta", etiqueta: "Cifras — etiqueta", grupo: "Títulos del inicio", valor: "Instalaciones", orden: 1 },
  { clave: "inicio.cifrasTitulo", etiqueta: "Cifras — título", grupo: "Títulos del inicio", valor: "El parque en cifras", orden: 2 },
  { clave: "inicio.exploraEtiqueta", etiqueta: "Accesos rápidos — etiqueta", grupo: "Títulos del inicio", valor: "Explora el parque", orden: 3 },
  { clave: "inicio.exploraTitulo", etiqueta: "Accesos rápidos — título", grupo: "Títulos del inicio", valor: "Todo lo que necesitas saber", orden: 4 },
  { clave: "inicio.exploraTexto", etiqueta: "Accesos rápidos — texto", grupo: "Títulos del inicio", valor: "Conoce las instalaciones, programas y la institución que administra el Parque Central de Santiago.", multiline: true, orden: 5 },
  { clave: "inicio.quienesEtiqueta", etiqueta: "Quiénes somos — etiqueta", grupo: "Títulos del inicio", valor: "Quiénes somos", orden: 6 },
  { clave: "inicio.quienesTitulo", etiqueta: "Quiénes somos — título", grupo: "Títulos del inicio", valor: "Una institución al servicio de Santiago", orden: 7 },
  { clave: "inicio.quienesTexto", etiqueta: "Quiénes somos — texto", grupo: "Títulos del inicio", valor: "El Parque Central de Santiago es administrado por un patronato sin fines de lucro, nacido del esfuerzo de casi veinte años de la Asociación para el Desarrollo, Inc. (APEDI) junto a instituciones públicas y privadas de la región.", multiline: true, orden: 8 },
  { clave: "inicio.mapaEtiqueta", etiqueta: "Mapa — etiqueta", grupo: "Títulos del inicio", valor: "Ubicación", orden: 9 },
  { clave: "inicio.mapaTitulo", etiqueta: "Mapa — título", grupo: "Títulos del inicio", valor: "Explora el parque", orden: 10 },
  { clave: "inicio.mapaTexto", etiqueta: "Mapa — texto", grupo: "Títulos del inicio", valor: "Ubica las principales instalaciones del Parque Central de Santiago en el mapa.", multiline: true, orden: 11 },

  { clave: "junta.modo", etiqueta: "Qué mostrar en las tarjetas", grupo: "Junta Directiva", valor: "logo", opciones: "logo:Logo de la institución,foto:Foto del representante", orden: 1 },

  { clave: "historia.modo", etiqueta: "Formato de la historia", grupo: "Historia", valor: "linea", opciones: "linea:Línea de tiempo,parrafo:Un solo texto", orden: 1 },
  {
    clave: "historia.parrafo",
    etiqueta: "Historia en un solo texto",
    grupo: "Historia",
    valor: [
      "El Parque Central de Santiago abrió sus puertas el 20 de febrero de 2018, tras casi dos décadas de gestiones de la Asociación para el Desarrollo, Inc. (APEDI) junto a instituciones públicas y privadas de la región.",
      "El 6 de abril de ese mismo año quedó formalmente constituido el Patronato para la Administración del Parque Central de Santiago, la entidad sin fines de lucro responsable de su gestión, administración y desarrollo.",
    ].join("\n\n"),
    multiline: true,
    orden: 2,
  },
  { clave: "historia.apedi", etiqueta: "Relación con APEDI", grupo: "Historia", orden: 3, valor: "El Parque Central de Santiago mantiene una estrecha relación con la Asociación para el Desarrollo, Inc. (APEDI), institución fundadora y actual presidenta del Patronato para la Administración del Parque Central de Santiago. El parque también trabaja de manera coordinada con diversas instituciones públicas, privadas, educativas y organizaciones de la sociedad civil, promoviendo alianzas estratégicas para el desarrollo de actividades recreativas, culturales, deportivas, ambientales y comunitarias.", multiline: true },

  { clave: "transparencia.quienesSomos", etiqueta: "Quiénes somos", grupo: "Transparencia", valor: "El Parque Central de Santiago es administrado por el Patronato para la Administración del Parque Central de Santiago, una entidad sin fines de lucro constituida el 6 de abril de 2018, resultado del esfuerzo conjunto entre la Asociación para el Desarrollo, Inc. (APEDI) y diecisiete instituciones públicas y privadas de la región. Está registrado bajo la Ley 122-05 del 8 de abril de 2005. RNC: 430-25261-1.", multiline: true, orden: 1 },
  { clave: "transparencia.marcoNormativo", etiqueta: "Marco normativo", grupo: "Transparencia", valor: "Ley 122-05 del 8 de abril de 2005, que regula las asociaciones sin fines de lucro en la República Dominicana.", multiline: true, orden: 2 },
  { clave: "transparencia.usoDonaciones", etiqueta: "Uso de donaciones", grupo: "Transparencia", valor: "El detalle sobre el uso de las donaciones recibidas se publicará en una fase posterior del proyecto.", multiline: true, orden: 3 },
  { clave: "transparencia.codigoEtica", etiqueta: "Código de ética", grupo: "Transparencia", valor: "El código de ética institucional se publicará en cuanto el Parque lo confirme.", multiline: true, orden: 4 },

  { clave: "reserva.calendarioTexto", etiqueta: "Texto del calendario", grupo: "Reserva", valor: "Todas las actividades programadas del parque están disponibles en la sección de Actividades.", multiline: true, orden: 1 },
];

async function main() {
  console.log("Sembrando el contenido editable de las secciones...");

  // Las listas solo se llenan si están vacías, para no duplicar ni pisar
  // ediciones hechas desde el panel.
  const listas = [
    ["hito", hitos],
    ["norma", normas],
    ["pasoReserva", pasosReserva],
    ["formaApoyo", formasApoyo],
    ["cifra", cifras],
  ] as const;

  for (const [modelo, datos] of listas) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = (prisma as any)[modelo];
    const existentes = await m.count();
    if (existentes > 0) {
      console.log(`  ${modelo}: ya tiene ${existentes} registros, se omite`);
      continue;
    }
    for (const [i, d] of datos.entries()) {
      await m.create({ data: { ...d, orden: i + 1 } });
    }
    console.log(`  ${modelo}: ${datos.length} registros creados`);
  }

  // Los textos se identifican por clave: se crean si faltan y se conserva el
  // valor de los que ya existen.
  let creados = 0;
  for (const t of textos) {
    const existe = await prisma.texto.findUnique({ where: { clave: t.clave } });
    if (existe) continue;
    await prisma.texto.create({ data: t });
    creados++;
  }
  console.log(`  textos: ${creados} creados, ${textos.length - creados} ya existían`);

  // Los encabezados se identifican por clave: se crean si faltan y se conserva
  // la foto de los que ya existen.
  let encabezadosCreados = 0;
  for (const e of encabezados) {
    const existe = await prisma.encabezadoPagina.findUnique({ where: { clave: e.clave } });
    if (existe) continue;
    await prisma.encabezadoPagina.create({ data: e });
    encabezadosCreados++;
  }
  console.log(
    `  encabezados: ${encabezadosCreados} creados, ${encabezados.length - encabezadosCreados} ya existían`,
  );
  console.log("Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
