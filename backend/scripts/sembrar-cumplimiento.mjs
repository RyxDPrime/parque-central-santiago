// Siembra lo que hace falta para aceptar o rechazar aportes con constancia.
//
// TODAS ESTAS LISTAS SON UN BORRADOR. Cuales son los motivos validos para
// rechazar un aporte, que origenes de fondos se admiten y a partir de que monto
// hay que declarar son decisiones del Parque y de su asesor legal, no nuestras.
// Se siembra algo razonable para que el sistema funcione desde el primer dia, y
// el equipo lo corrige desde el panel sin tocar codigo.
//
// No pisa lo que ya exista.
//
//   node scripts/sembrar-cumplimiento.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MOTIVOS = [
  { nombre: 'No se pudo verificar el origen de los fondos', nota: 'Se pidió aclaración y no llegó, o lo aportado no basta' },
  { nombre: 'La información declarada es incompleta o inconsistente' },
  { nombre: 'El aporte no corresponde a los fines del Parque' },
  { nombre: 'El donante figura en una lista restrictiva' },
  { nombre: 'El aporte viene con condiciones que el Parque no puede aceptar' },
  { nombre: 'Posible conflicto de interés' },
  { nombre: 'Duplicado o error en el formulario', nota: 'No es un rechazo de fondo: la persona mandó lo mismo dos veces' },
  { nombre: 'No es una solicitud real', nota: 'Mensajes de prueba o correo basura' },
]

const ORIGENES = [
  { nombre: 'Salario o ingresos por trabajo' },
  { nombre: 'Actividad comercial o empresarial' },
  { nombre: 'Ejercicio profesional independiente' },
  { nombre: 'Rentas o inversiones' },
  { nombre: 'Herencia o donación recibida' },
  { nombre: 'Venta de un bien' },
  { nombre: 'Fondos institucionales de la empresa' },
  { nombre: 'Presupuesto de responsabilidad social corporativa' },
  { nombre: 'Otro — lo explico en el mensaje' },
]

const PLANTILLAS = [
  {
    clave: 'aporte.aceptado',
    nombre: 'Aporte aceptado',
    descripcion:
      'Lo que se le manda a quien aporta cuando el Parque acepta su aporte. Lo que escribas en "Mensaje para la persona" al decidir entra donde esta el hueco {{respuesta}}.',
    orden: 3,
    asunto: 'Sobre tu aporte al Parque Central de Santiago',
    cuerpo: `Hola {{primerNombre}},

Gracias de nuevo por querer aportar al Parque Central de Santiago. Revisamos tu
mensaje y con mucho gusto lo aceptamos.

{{respuesta}}

Si te queda alguna duda, puedes escribirnos respondiendo a este correo, llamar
al 809-583-9581 o escribir por WhatsApp al 849-580-7344.

Gracias por sostener este espacio.

Parque Central de Santiago`,
  },
  {
    clave: 'aporte.rechazado',
    nombre: 'Aporte no aceptado',
    descripcion:
      'Lo que se le manda cuando el Parque no puede aceptar un aporte. IMPORTANTE: el motivo que se elige al rechazar es interno y NO viaja en este correo. Lo unico que la persona lee es lo que se escriba en "Mensaje para la persona", asi que conviene que sea breve y respetuoso.',
    orden: 4,
    asunto: 'Sobre tu aporte al Parque Central de Santiago',
    cuerpo: `Hola {{primerNombre}},

Gracias por pensar en el Parque Central de Santiago y por tomarte el tiempo de
escribirnos.

Después de revisar tu mensaje, en esta ocasión no podemos dar curso a tu aporte.

{{respuesta}}

Te agradecemos igualmente el gesto, y quedamos a la orden si en el futuro
quieres apoyar al Parque de otra manera: también recibimos voluntariado y
colaboración institucional.

Parque Central de Santiago`,
  },
]

const TEXTOS = [
  {
    clave: 'donaciones.umbral',
    etiqueta: 'Monto desde el que hay que declarar el origen',
    grupo: 'Donaciones',
    orden: 9,
    ayuda:
      'A partir de este monto en pesos, el formulario pide documento de identidad y origen de los fondos. En cero se le pide a todo el mundo. Los patrocinios institucionales lo declaran siempre, sin importar el monto. CONFIRMAR ESTE VALOR CON EL ASESOR LEGAL.',
    valor: '25000',
  },
  {
    clave: 'donaciones.avisoDeclaracion',
    etiqueta: 'Por qué se piden estos datos',
    grupo: 'Donaciones',
    multiline: true,
    orden: 10,
    ayuda: 'Se muestra encima de los campos de origen de fondos, para que quien dona entienda por qué se le preguntan.',
    valor:
      'El Parque es una asociación sin fines de lucro y está obligado a conocer el origen de los aportes que recibe. Estos datos se usan solo para esa revisión y no se comparten con nadie más.',
  },
]

async function main() {
  // La plantilla vieja pasa a ser la de aceptacion, para no perder el texto que
  // el Parque ya hubiera escrito.
  const vieja = await prisma.plantillaCorreo.findUnique({ where: { clave: 'aporte.respuesta' } })
  if (vieja) {
    await prisma.plantillaCorreo.update({
      where: { id: vieja.id },
      data: { clave: 'aporte.aceptado', nombre: 'Aporte aceptado' },
    })
    console.log('Plantilla "aporte.respuesta" renombrada a "aporte.aceptado".')
  }

  for (const plantilla of PLANTILLAS) {
    const ya = await prisma.plantillaCorreo.findUnique({ where: { clave: plantilla.clave } })
    if (ya) {
      console.log(`Plantilla "${plantilla.clave}": ya existe, no se toca.`)
      continue
    }
    await prisma.plantillaCorreo.create({ data: plantilla })
    console.log(`Plantilla "${plantilla.clave}": creada.`)
  }

  const sembrar = async (nombre, delegado, filas) => {
    const hay = await delegado.count()
    if (hay > 0) {
      console.log(`${nombre}: ya hay ${hay}, no se toca.`)
      return
    }
    await delegado.createMany({ data: filas.map((f, i) => ({ ...f, orden: i + 1 })) })
    console.log(`${nombre}: sembrados ${filas.length}.`)
  }
  await sembrar('Motivos de rechazo', prisma.motivoRechazo, MOTIVOS)
  await sembrar('Orígenes de fondos', prisma.origenFondos, ORIGENES)

  let creados = 0
  for (const texto of TEXTOS) {
    if (await prisma.texto.findUnique({ where: { clave: texto.clave } })) continue
    await prisma.texto.create({ data: texto })
    creados++
  }
  console.log(`Textos creados: ${creados} de ${TEXTOS.length}.`)

  console.log('\nPENDIENTE DE CONFIRMAR CON EL ASESOR LEGAL DEL PARQUE:')
  console.log('  - El umbral desde el que hay que declarar el origen (hoy: RD$ 25,000)')
  console.log('  - Si los motivos de rechazo sembrados son los correctos')
  console.log('  - Si la lista de orígenes de fondos cubre lo que hace falta')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
