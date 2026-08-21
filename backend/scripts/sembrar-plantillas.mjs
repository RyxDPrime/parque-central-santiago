// Siembra las plantillas de respuesta a una solicitud de reserva.
//
// Son dos, una por cada decision que le importa a quien solicito: aprobada y
// rechazada. El texto es un punto de partida; el Parque lo reescribe desde el
// panel sin tocar codigo, que es justo el motivo de que viva en la base.
//
// No pisa lo que ya exista: solo crea las que falten.
//
//   node scripts/sembrar-plantillas.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLANTILLAS = [
  {
    clave: 'reserva.aprobada',
    nombre: 'Solicitud aprobada',
    descripcion:
      'Lo que se le manda a quien solicito cuando se pulsa Aprobar. Sale solo, con los datos de esa solicitud ya puestos.',
    orden: 1,
    asunto: 'Tu solicitud de reserva fue aprobada - {{espacio}}',
    cuerpo: `Hola {{primerNombre}},

Tu solicitud de reserva en el Parque Central de Santiago fue APROBADA.

ESTO ES LO QUE QUEDO RESERVADO
Espacio: {{espacio}}
Actividad: {{tipoActividad}}
Fecha: {{fecha}}
Horario: {{horaInicio}} a {{horaFin}}
Personas: {{personas}}

{{motivo}}

ANTES DE VENIR
Preséntate en la administración del parque el día de tu actividad. Si algo
cambia —la fecha, la hora o la cantidad de personas— avísanos con tiempo para
poder acomodarlo.

Cualquier duda: 809-583-9581, o por WhatsApp al 849-580-7344.

Te esperamos.

Parque Central de Santiago`,
  },
  {
    clave: 'reserva.rechazada',
    nombre: 'Solicitud rechazada',
    descripcion:
      'Lo que se le manda cuando se pulsa Rechazar. El motivo que se escriba al rechazar aparece dentro del correo.',
    orden: 2,
    asunto: 'Sobre tu solicitud de reserva - {{espacio}}',
    cuerpo: `Hola {{primerNombre}},

Gracias por escribirnos. Revisamos tu solicitud para usar {{espacio}} el
{{fecha}}, y lamentamos decirte que esta vez no podemos aprobarla.

{{motivo}}

Esto no cierra la puerta: si quieres proponer otra fecha, otro espacio o hacer
algún ajuste, escríbenos y lo vemos con gusto.

Puedes contactarnos al 809-583-9581, o por WhatsApp al 849-580-7344.

Parque Central de Santiago`,
  },
]

async function main() {
  let creadas = 0
  for (const plantilla of PLANTILLAS) {
    const existe = await prisma.plantillaCorreo.findUnique({ where: { clave: plantilla.clave } })
    if (existe) {
      console.log(`"${plantilla.clave}": ya existe, no se toca.`)
      continue
    }
    await prisma.plantillaCorreo.create({ data: plantilla })
    console.log(`"${plantilla.clave}": creada.`)
    creadas++
  }
  const total = await prisma.plantillaCorreo.count()
  console.log(`Plantillas creadas ahora: ${creadas}. En total: ${total}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
