// Siembra la plantilla de respuesta y los textos de la pagina de Donaciones.
//
// Los datos bancarios se siembran VACIOS a proposito. No los tenemos, y un
// numero de cuenta inventado en una pagina de donaciones es de las peores cosas
// que puede publicar un sitio: la pagina esconde ese bloque mientras esten en
// blanco, y aparece solo cuando el Parque los escriba desde el panel.
//
// No pisa lo que ya exista.
//
//   node scripts/sembrar-donaciones.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLANTILLA = {
  clave: 'aporte.respuesta',
  nombre: 'Respuesta a quien quiere aportar',
  descripcion:
    'Lo que se le manda al marcar un aporte como atendido. Lo que escribas en "Respuesta" al atenderlo entra donde esta el hueco {{respuesta}}.',
  orden: 3,
  asunto: 'Sobre tu aporte al Parque Central de Santiago',
  cuerpo: `Hola {{primerNombre}},

Gracias de nuevo por querer aportar al Parque Central de Santiago. Ya revisamos
tu mensaje.

{{respuesta}}

Si te queda alguna duda, puedes escribirnos respondiendo a este correo, llamar
al 809-583-9581 o escribir por WhatsApp al 849-580-7344.

Gracias por sostener este espacio.

Parque Central de Santiago`,
}

const TEXTOS = [
  {
    clave: 'donaciones.intro',
    etiqueta: 'Por qué importa tu aporte',
    grupo: 'Donaciones',
    multiline: true,
    orden: 1,
    ayuda: 'Párrafo de apertura de la página de Donaciones, debajo del título.',
    valor:
      'El Parque Central de Santiago es una asociación sin fines de lucro. Mantener 850 tareas de áreas verdes, las canchas, los kioscos y los programas que se desarrollan aquí cuesta dinero todos los días, y cada aporte se traduce en algo que la ciudad usa.',
  },
  {
    clave: 'donaciones.destino',
    etiqueta: 'A qué se destinan los aportes',
    grupo: 'Donaciones',
    multiline: true,
    orden: 2,
    ayuda: 'Qué se hace con lo que se recibe. Cuanto más concreto, más confianza da.',
    valor:
      'Los aportes se destinan al mantenimiento de las instalaciones, al cuidado de las áreas verdes y a los programas deportivos y culturales abiertos a la comunidad.',
  },
  // ── Datos bancarios: en blanco hasta que el Parque los confirme ──
  {
    clave: 'donaciones.banco',
    etiqueta: 'Banco',
    grupo: 'Donaciones',
    orden: 3,
    ayuda: 'Nombre del banco. Mientras esté vacío, el bloque de transferencia no aparece en la página.',
    valor: '',
  },
  {
    clave: 'donaciones.tipoCuenta',
    etiqueta: 'Tipo de cuenta',
    grupo: 'Donaciones',
    orden: 4,
    ayuda: 'Por ejemplo: Cuenta de ahorros, Cuenta corriente.',
    valor: '',
  },
  {
    clave: 'donaciones.cuenta',
    etiqueta: 'Número de cuenta',
    grupo: 'Donaciones',
    orden: 5,
    ayuda: 'Sin este dato el bloque de transferencia no se muestra. Revísalo dos veces antes de guardar.',
    valor: '',
  },
  {
    clave: 'donaciones.titular',
    etiqueta: 'A nombre de',
    grupo: 'Donaciones',
    orden: 6,
    ayuda: 'Titular de la cuenta, tal como debe escribirse en la transferencia.',
    valor: 'Patronato para la Administración del Parque Central de Santiago',
  },
  {
    clave: 'donaciones.rnc',
    etiqueta: 'RNC',
    grupo: 'Donaciones',
    orden: 7,
    ayuda: 'El RNC del Patronato, para quien necesite comprobante fiscal.',
    valor: '430-25261-1',
  },
  {
    clave: 'donaciones.notaTransferencia',
    etiqueta: 'Qué hacer después de transferir',
    grupo: 'Donaciones',
    multiline: true,
    orden: 8,
    ayuda: 'Instrucción que se muestra debajo de los datos bancarios.',
    valor:
      'Si transfieres, escríbenos con el comprobante para poder agradecerte y, si lo necesitas, emitirte una certificación de tu aporte.',
  },
]

async function main() {
  const existe = await prisma.plantillaCorreo.findUnique({ where: { clave: PLANTILLA.clave } })
  if (existe) {
    console.log(`Plantilla "${PLANTILLA.clave}": ya existe, no se toca.`)
  } else {
    await prisma.plantillaCorreo.create({ data: PLANTILLA })
    console.log(`Plantilla "${PLANTILLA.clave}": creada.`)
  }

  let creados = 0
  for (const texto of TEXTOS) {
    const ya = await prisma.texto.findUnique({ where: { clave: texto.clave } })
    if (ya) continue
    await prisma.texto.create({ data: texto })
    creados++
  }
  console.log(`Textos de Donaciones creados: ${creados} de ${TEXTOS.length}.`)

  const sinLlenar = await prisma.texto.findMany({
    where: { grupo: 'Donaciones', valor: '' },
    select: { etiqueta: true },
  })
  if (sinLlenar.length > 0) {
    console.log('\nPendientes de que el Parque los escriba (la pagina los esconde mientras tanto):')
    sinLlenar.forEach((t) => console.log(`  - ${t.etiqueta}`))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
