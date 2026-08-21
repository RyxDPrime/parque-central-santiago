// Siembra los espacios que se pueden reservar y la lista de tipos de actividad.
//
// Las dos listas son un BORRADOR. La de actividades sobre todo: cuáles se
// permiten y cuáles no es una decisión del Parque, no nuestra. Se siembra algo
// razonable para que el formulario funcione desde el primer día, y el equipo lo
// corrige desde el panel sin tocar código.
//
// No pisa lo que ya exista: si la tabla tiene filas, no hace nada.
//
//   node scripts/sembrar-reservas.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ESPACIOS = [
  { nombre: 'Kiosco pequeño', descripcion: 'Kiosco techado con mesa, para grupos familiares. Hay 24 en el parque.', cantidad: 24, capacidad: 15, requierePago: true },
  { nombre: 'Kiosco grande', descripcion: 'Kiosco techado amplio, para grupos numerosos. Hay 8 en el parque.', cantidad: 8, capacidad: 40, requierePago: true },
  { nombre: 'Área de picnic', descripcion: 'Zona abierta con mesas, bajo los árboles.', capacidad: 30, requierePago: true },
  { nombre: 'Anfiteatro', descripcion: 'Espacio con gradas para presentaciones y actos culturales.', capacidad: 300, requierePago: true },
  { nombre: 'Área para ferias y eventos', descripcion: 'Explanada para ferias, exposiciones y actividades de gran formato.', capacidad: 1000, requierePago: true },
  { nombre: 'Hangar', descripcion: 'Espacio techado de gran tamaño. Hay 2 en el parque.', cantidad: 2, capacidad: 200, requierePago: true },
  { nombre: 'Cancha de baloncesto', descripcion: 'Cancha techada, para entrenamientos y encuentros.', capacidad: 30, requierePago: true },
  { nombre: 'Cancha de voleibol', descripcion: 'Cancha para entrenamientos y encuentros.', capacidad: 25, requierePago: true },
  { nombre: 'Cancha de tenis', descripcion: 'Cancha para práctica y encuentros.', capacidad: 10, requierePago: true },
  { nombre: 'Campo de fútbol', descripcion: 'Campo de grama para entrenamientos y partidos. Hay 2 en el parque.', cantidad: 2, capacidad: 40, requierePago: true },
  { nombre: 'Campo de béisbol', descripcion: 'Campo para entrenamientos y partidos.', capacidad: 40, requierePago: true },
  { nombre: 'Campo de softbol', descripcion: 'Campo para entrenamientos y partidos.', capacidad: 40, requierePago: true },
]

const TIPOS = [
  // Permitidos
  { nombre: 'Cumpleaños o compartir familiar', permitido: true },
  { nombre: 'Actividad deportiva o entrenamiento', permitido: true },
  { nombre: 'Actividad escolar o educativa', permitido: true },
  { nombre: 'Actividad cultural o artística', permitido: true },
  { nombre: 'Feria o exposición', permitido: true },
  { nombre: 'Actividad de una institución sin fines de lucro', permitido: true },
  { nombre: 'Sesión de fotos o grabación', permitido: true },
  { nombre: 'Actividad de una empresa para su personal', permitido: true },
  // No permitidos: se publican al lado del formulario para que quien iba a
  // pedir algo que no procede se entere antes de perder su tiempo y el del
  // equipo. Esta es la parte que el Parque tiene que confirmar.
  { nombre: 'Misas, cultos y actividades religiosas', permitido: false },
  { nombre: 'Actividades políticas o partidarias', permitido: false },
  { nombre: 'Actividades con venta o consumo de alcohol', permitido: false },
  { nombre: 'Fiestas con música a alto volumen', permitido: false },
  { nombre: 'Venta al público o actividad comercial', permitido: false },
]

async function sembrar(nombre, delegado, filas) {
  const existentes = await delegado.count()
  if (existentes > 0) {
    console.log(`${nombre}: ya hay ${existentes}, no se toca.`)
    return
  }
  await delegado.createMany({
    data: filas.map((fila, i) => ({ ...fila, orden: i + 1 })),
  })
  console.log(`${nombre}: sembrados ${filas.length}.`)
}

async function main() {
  await sembrar('Espacios reservables', prisma.espacioReservable, ESPACIOS)
  await sembrar('Tipos de actividad', prisma.tipoActividad, TIPOS)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
