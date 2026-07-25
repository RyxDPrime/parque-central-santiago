import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fuente: levantamiento-informacion-parque-central.docx, listados de miembros pcs.docx,
// Calendario de Actividades Programadas 2026.docx y logos instituciones/
// (carpeta de Drive del Parque Central de Santiago, junio-julio 2026)
const juntaDirectiva = [
  { institucion: "Asociación para el Desarrollo, Inc.", representante: "Juan Carlos Ortiz", cargo: "Presidente", logoUrl: "/images/logos/apedi.png" },
  { institucion: "Gobernación de Santiago", representante: "Rosa Santos", cargo: "Vicepresidente", logoUrl: "/images/logos/gobernacion-santiago.png" },
  { institucion: "Pontificia Universidad Católica Madre y Maestra", representante: "Evelissy Rodríguez", cargo: "Tesorero", logoUrl: "/images/logos/pucmm.png" },
  { institucion: "Corporación Zona Franca Santiago", representante: "Miguel Lama", cargo: "Secretario", logoUrl: "/images/logos/czfs.png" },
  { institucion: "Alcaldía de Santiago", representante: "Ulises Rodríguez", cargo: "Vocal", logoUrl: "/images/logos/alcaldia.svg" },
  { institucion: "Asociación de Industriales de la Región Norte", representante: "Ruska Santos", cargo: "Vocal", logoUrl: "/images/logos/airen.png" },
  { institucion: "Oficina Senatorial de Santiago", representante: "Daniel Rivera", cargo: "Vocal", logoUrl: "/images/logos/senado-santiago.jpg" },
  { institucion: "Arzobispado de Santiago", representante: "Héctor Rafael Rodríguez", cargo: "Vocal", logoUrl: "/images/logos/arzobispado.svg" },
  { institucion: "Consejo para el Desarrollo Estratégico de Santiago", representante: "Ricardo Fondeur", cargo: "Vocal", logoUrl: "/images/logos/cdes.png" },
  { institucion: "Sociedad Ecológica del Cibao", representante: "Belkis García", cargo: "Vocal", logoUrl: "/images/logos/soeci.jpg" },
  { institucion: "Acción Callejera", representante: "Maikel Vila", cargo: "Vocal", logoUrl: "/images/logos/accion-callejera.png" },
  { institucion: "Fundación Solidaridad", representante: "Juan Castillo", cargo: "Vocal", logoUrl: "/images/logos/fundacion-solidaridad.png" },
  { institucion: "Universidad ISA", representante: "Edwin Reyes", cargo: "Vocal", logoUrl: "/images/logos/universidad-isa.jpg" },
  { institucion: "Universidad Tecnológica de Santiago (UTESA)", representante: "Lily Rodríguez", cargo: "Vocal", logoUrl: "/images/logos/utesa.png" },
  { institucion: "Ministerio de Medio Ambiente", representante: "Winston Velásquez", cargo: "Vocal", logoUrl: "/images/logos/medio-ambiente.png" },
  { institucion: "Cámara de Comercio y Producción de Santiago", representante: "Luis Campos", cargo: "Vocal", logoUrl: "/images/logos/camara-santiago.png" },
  { institucion: "Asociación de Comerciantes e Industriales", representante: "Juan José Jiménez", cargo: "Vocal", logoUrl: "/images/logos/acis.jpg" },
];

const instalaciones = [
  { nombre: "Canchas de Baloncesto", descripcion: "Espacios destinados a la práctica recreativa y competitiva del baloncesto, disponibles para entrenamientos y actividades deportivas.", cantidad: null },
  { nombre: "Canchas de Tenis", descripcion: "Instalaciones acondicionadas para la práctica del tenis, utilizadas para clases, entrenamientos y torneos.", cantidad: null },
  { nombre: "Canchas de Voleibol", descripcion: "Áreas habilitadas para la práctica del voleibol recreativo y competitivo.", cantidad: null },
  { nombre: "Campos de Fútbol", descripcion: "Campos reglamentarios utilizados para entrenamientos, torneos y actividades del Cibao Fútbol Club y otras organizaciones deportivas.", cantidad: 2 },
  { nombre: "Cancha de Disc Golf", descripcion: "Espacio especializado para la práctica de disc golf, promoviendo una alternativa recreativa al aire libre.", cantidad: null },
  { nombre: "Área Infantil", descripcion: "Zona de juegos diseñada para el entretenimiento y la recreación segura de niños y niñas.", cantidad: null },
  { nombre: "Anfiteatro", descripcion: "Espacio destinado a la realización de actividades culturales, artísticas, educativas y comunitarias.", cantidad: null },
  { nombre: "Áreas de Picnic", descripcion: "Zonas verdes equipadas para la recreación familiar, reuniones y actividades al aire libre.", cantidad: null },
  { nombre: "Kioscos Grandes", descripcion: "Estructuras disponibles para reuniones familiares, eventos y actividades organizadas dentro del parque.", cantidad: 8 },
  { nombre: "Kioscos Pequeños", descripcion: "Espacios destinados al descanso y disfrute de los visitantes en diferentes áreas del parque.", cantidad: 24 },
  { nombre: "Parqueos", descripcion: "Áreas de estacionamiento facilitando el acceso de los visitantes.", cantidad: 450 },
  { nombre: "Área para Ferias y Eventos", descripcion: "Espacio multipropósito destinado a la realización de ferias, exposiciones, bazares, actividades comerciales, recreativas e institucionales.", cantidad: null },
  { nombre: "Hangares", descripcion: "Estructuras de apoyo utilizadas para almacenamiento, logística y soporte operativo de las actividades desarrolladas en el parque.", cantidad: 2 },
];

const programas = [
  {
    nombre: "Cibao Fútbol Club",
    categoria: "Deportivo · Fútbol",
    descripcion: "Programa de formación y entrenamiento deportivo dirigido a niños, jóvenes y adultos. Promueve la práctica del fútbol mediante clases, entrenamientos y actividades competitivas, fomentando el desarrollo físico, el trabajo en equipo y la disciplina.",
  },
  {
    nombre: "Escuela de Tenis – Washington Heights Tennis Association",
    categoria: "Deportivo · Tenis",
    descripcion: "Programa de enseñanza y práctica del tenis para diferentes edades y niveles de experiencia. Las clases son impartidas por instructores capacitados, contribuyendo al aprendizaje técnico del deporte y al desarrollo de hábitos saludables.",
  },
  {
    nombre: "Tirolesa",
    categoria: "Aventura familiar",
    descripcion: "Servicio recreativo que ofrece una experiencia de aventura para visitantes de diferentes edades, bajo normas de seguridad establecidas. Constituye una de las principales atracciones del parque para el entretenimiento familiar.",
  },
  {
    nombre: "Fun Stop – Carritos Corredores",
    categoria: "Recreación infantil",
    descripcion: "Servicio de alquiler de carritos corredores para el disfrute de niños y familias dentro de las áreas habilitadas del parque. Esta atracción complementa la oferta recreativa y promueve el esparcimiento en un ambiente seguro.",
  },
];

// Calendario de Actividades Programadas 2026 (documento entregado por el Parque)
const actividades = [
  { titulo: "Clásico de Ciclismo MTB", fechaInicio: "2026-07-05", fechaFin: null },
  { titulo: "Junte Neocatecumenal de la Iglesia Católica", fechaInicio: "2026-07-12", fechaFin: null },
  { titulo: "Feria Expo AMAPROSAN", fechaInicio: "2026-07-15", fechaFin: "2026-07-19" },
  { titulo: "Summer Food Fest", fechaInicio: "2026-07-31", fechaFin: "2026-08-02" },
  { titulo: "Raulín Rodríguez en Concierto", fechaInicio: "2026-08-15", fechaFin: null },
  { titulo: "Maratón 5K Club Banreservas", fechaInicio: "2026-08-16", fechaFin: null },
  { titulo: "Actividad Infantil My Happy Farm", fechaInicio: "2026-09-05", fechaFin: "2026-09-06" },
  { titulo: "Evento Empresarial de Cemento Cibao", fechaInicio: "2026-09-28", fechaFin: null },
  { titulo: "Expocibao 2026", fechaInicio: "2026-09-30", fechaFin: "2026-10-04" },
  { titulo: "Oktoberfest 2026", fechaInicio: "2026-10-16", fechaFin: "2026-10-18" },
  { titulo: "Festival de Mascotas", fechaInicio: "2026-11-06", fechaFin: "2026-11-08" },
  { titulo: "Un Paso por Mi Familia", fechaInicio: "2026-11-22", fechaFin: null },
  { titulo: "Récord Guinness de la Música Criolla", fechaInicio: "2026-12-11", fechaFin: null },
];

// Selección curada de fotografías reales (FOTOS Y AUDIOVISUALES / IMAGENES DEL PARQUE C)
const galeria = [
  { titulo: "Vista aérea del Parque Central de Santiago", url: "/images/galeria/vista-aerea-parque.jpg", categoria: "Parque" },
  { titulo: "Campo de fútbol", url: "/images/galeria/campo-futbol.jpg", categoria: "Instalaciones" },
  { titulo: "Cancha de tenis", url: "/images/galeria/cancha-tenis.jpg", categoria: "Instalaciones" },
  { titulo: "Cancha de baloncesto", url: "/images/galeria/cancha-basketball.jpg", categoria: "Instalaciones" },
  { titulo: "Cancha de voleibol", url: "/images/galeria/voleibol.jpg", categoria: "Instalaciones" },
  { titulo: "Parque infantil", url: "/images/galeria/parque-infantil.jpg", categoria: "Instalaciones" },
  { titulo: "Gimnasio al aire libre", url: "/images/galeria/gimnasio-aire-libre.jpg", categoria: "Instalaciones" },
  { titulo: "Ciclovía y senderos", url: "/images/galeria/ciclistas.jpg", categoria: "Parque" },
  { titulo: "Cibao Fútbol Club", url: "/images/galeria/cibao-futbol-club.jpg", categoria: "Programas" },
  { titulo: "Fun Stop", url: "/images/galeria/funstop.jpg", categoria: "Programas" },
  { titulo: "Carnaval 2025", url: "/images/galeria/carnaval-2025.jpg", categoria: "Eventos" },
  { titulo: "Navidad en el Parque", url: "/images/galeria/navidad-en-el-parque.jpg", categoria: "Eventos" },
  { titulo: "Maratón 5K Club Banreservas", url: "/images/galeria/maraton-5k.jpg", categoria: "Eventos" },
  { titulo: "Día del Yoga", url: "/images/galeria/dia-del-yoga.jpg", categoria: "Eventos" },
  { titulo: "Entrada principal del parque", url: "/images/galeria/entrada-parque.jpg", categoria: "Parque" },
];

async function main() {
  console.log("Sembrando datos reales del Parque Central de Santiago...");

  await prisma.juntaDirectivo.deleteMany();
  for (const [i, m] of juntaDirectiva.entries()) {
    const { logoUrl, ...member } = m;
    await prisma.juntaDirectivo.create({ data: { ...member, orden: i } });
  }

  await prisma.instalacion.deleteMany();
  for (const [i, inst] of instalaciones.entries()) {
    await prisma.instalacion.create({ data: { ...inst, orden: i } });
  }

  await prisma.programa.deleteMany();
  for (const [i, p] of programas.entries()) {
    await prisma.programa.create({ data: { ...p, orden: i } });
  }

  // Aliados y patrocinadores: mismas instituciones de la Junta Directiva, con sus logos reales.
  await prisma.aliado.deleteMany();
  for (const [i, m] of juntaDirectiva.entries()) {
    await prisma.aliado.create({ data: { nombre: m.institucion, logoUrl: m.logoUrl, orden: i } });
  }

  await prisma.actividad.deleteMany();
  for (const a of actividades) {
    await prisma.actividad.create({
      data: {
        titulo: a.titulo,
        fechaInicio: new Date(a.fechaInicio),
        fechaFin: a.fechaFin ? new Date(a.fechaFin) : null,
      },
    });
  }

  await prisma.galeriaItem.deleteMany();
  for (const [i, g] of galeria.entries()) {
    await prisma.galeriaItem.create({ data: { ...g, tipo: "imagen", orden: i } });
  }

  console.log("Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
