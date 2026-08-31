// Siembra las formas de hacer efectivo un aporte.
//
// "Disponible" en falso significa que la opcion se ve pero no se puede elegir:
// aparece anunciada como que todavia no esta. Es el caso de la tarjeta, que se
// enciende desde el panel el dia que el Parque se afilie a la pasarela, sin
// tocar codigo y sin volver a desplegar.
//
// No pisa lo que ya exista.
//
//   node scripts/sembrar-metodos-pago.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const METODOS = [
  {
    nombre: 'Transferencia bancaria',
    nota: 'A las cuentas del Patronato, que se muestran en la misma página',
    disponible: true,
  },
  {
    nombre: 'Efectivo en la administración',
    nota: 'Pasando por la oficina del parque, en horario de oficina',
    disponible: true,
  },
  {
    nombre: 'Cheque',
    nota: 'A nombre del Patronato',
    disponible: true,
  },
  {
    nombre: 'Tarjeta de crédito o débito',
    nota: 'Todavía no está habilitado: falta la afiliación con la plataforma de pagos',
    disponible: false,
  },
]

async function main() {
  const hay = await prisma.metodoPago.count()
  if (hay > 0) {
    console.log(`Métodos de pago: ya hay ${hay}, no se toca.`)
  } else {
    await prisma.metodoPago.createMany({
      data: METODOS.map((m, i) => ({ ...m, orden: i + 1 })),
    })
    console.log(`Métodos de pago: sembrados ${METODOS.length}.`)
  }

  const todos = await prisma.metodoPago.findMany({ orderBy: { orden: 'asc' } })
  for (const m of todos) {
    console.log(`  ${m.disponible ? 'disponible' : 'anunciado '}  ${m.nombre}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
