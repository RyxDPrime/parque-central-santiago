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
  { icono: "ti-hand-heart", etiqueta: "Voluntariado", titulo: "Ser voluntario", texto: "Súmate a las jornadas de mantenimiento, educación ambiental y actividades comunitarias del parque." },
  { icono: "ti-coin", etiqueta: "Donaciones", titulo: "Hacer una donación", texto: "Tu aporte ayuda a mantener las instalaciones y los programas del parque. Próximamente habilitaremos donaciones en línea." },
  { icono: "ti-plant-2", etiqueta: "Reforestación", titulo: "Donar un árbol o una flor", texto: "Contribuye a la reforestación y el embellecimiento del parque dedicando un árbol o una flor." },
];

const cifras = [
  { numero: "2 campos", descripcion: "Dos campos de fútbol reglamentarios, además de canchas de baloncesto, tenis, voleibol y disc golf para toda la comunidad.", imagenUrl: "/images/galeria/campo-futbol.jpg", etiqueta: "Complejo Deportivo", enlaceTexto: "Ver instalaciones y servicios", enlaceUrl: "/instalaciones-y-servicios" },
  { numero: "17", descripcion: "Instituciones públicas y privadas conforman la Junta Directiva del Patronato para la Administración del Parque Central de Santiago.", imagenUrl: "/images/galeria/entrada-parque.jpg", etiqueta: "Patronato PCS", enlaceTexto: "Conoce la Junta Directiva", enlaceUrl: "/junta-directiva" },
  { numero: "32 kioscos", descripcion: "8 grandes y 24 pequeños para reuniones familiares.", imagenUrl: "/images/galeria/gimnasio-aire-libre.jpg", etiqueta: "Áreas de Picnic", enlaceTexto: null, enlaceUrl: null },
  { numero: "450", descripcion: "Espacios de estacionamiento para los visitantes.", imagenUrl: "/images/galeria/voleibol.jpg", etiqueta: "Parqueos", enlaceTexto: null, enlaceUrl: null },
  { numero: "2018", descripcion: "Año de inauguración del parque, resultado de casi dos décadas de gestión de la Asociación para el Desarrollo, Inc. (APEDI).", imagenUrl: "/images/galeria/cancha-tenis.jpg", etiqueta: "Desde 2018", enlaceTexto: "Conoce nuestra historia", enlaceUrl: "/sobre-el-parque" },
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

  { clave: "historia.apedi", etiqueta: "Relación con APEDI", grupo: "Historia", valor: "El Parque Central de Santiago mantiene una estrecha relación con la Asociación para el Desarrollo, Inc. (APEDI), institución fundadora y actual presidenta del Patronato para la Administración del Parque Central de Santiago. El parque también trabaja de manera coordinada con diversas instituciones públicas, privadas, educativas y organizaciones de la sociedad civil, promoviendo alianzas estratégicas para el desarrollo de actividades recreativas, culturales, deportivas, ambientales y comunitarias.", multiline: true, orden: 1 },

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
  console.log("Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
