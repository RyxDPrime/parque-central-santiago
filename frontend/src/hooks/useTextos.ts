import { useApiData } from './useApiData'
import { api } from '../api/client'

/**
 * Valores de respaldo. Si una clave todavía no existe en la base de datos, o si
 * el servidor no responde, la página muestra esto en vez de quedar en blanco.
 */
const RESPALDO: Record<string, string> = {
  'contacto.direccion': 'Av. Bartolomé Colón esq. Padre Las Casas, Santiago de los Caballeros',
  'contacto.email': 'asistentepcs@gmail.com',
  'contacto.telefono': '(809) 583-9581',
  'contacto.whatsapp': '(849) 580-7344',
  'contacto.horarioParque': '5:30 a.m. – 9:00 p.m.',
  'contacto.horarioOficina': 'lun–vie 8:30 a.m. – 5:00 p.m.',
  'inicio.heroTitulo': 'El pulmón verde de Santiago',
  'inicio.heroTexto':
    'Un espacio para la recreación, el deporte, la cultura y la convivencia ciudadana, administrado por el Patronato para la Administración del Parque Central de Santiago.',
  'inicio.cifrasEtiqueta': 'Instalaciones',
  'inicio.cifrasTitulo': 'El parque en cifras',
  'inicio.exploraEtiqueta': 'Explora el parque',
  'inicio.exploraTitulo': 'Todo lo que necesitas saber',
  'inicio.exploraTexto':
    'Conoce las instalaciones, programas y la institución que administra el Parque Central de Santiago.',
  'inicio.quienesEtiqueta': 'Quiénes somos',
  'inicio.quienesTitulo': 'Una institución al servicio de Santiago',
  'inicio.quienesTexto':
    'El Parque Central de Santiago es administrado por un patronato sin fines de lucro, nacido de más de 25 años de gestión de la Asociación para el Desarrollo, Inc. (APEDI) junto a instituciones públicas y privadas de la región.',
  'inicio.mapaEtiqueta': 'Ubicación',
  'inicio.mapaTitulo': 'Explora el parque',
  'inicio.mapaTexto':
    'Ubica las principales instalaciones del Parque Central de Santiago en el mapa.',
  'junta.modo': 'logo',
  'historia.modo': 'linea',
  'historia.parrafo':
    'El Parque Central de Santiago abrió sus puertas el 20 de febrero de 2018, tras casi dos décadas de gestiones de la Asociación para el Desarrollo, Inc. (APEDI).',
  'historia.apedi':
    'El Parque Central de Santiago mantiene una estrecha relación con la Asociación para el Desarrollo, Inc. (APEDI), institución fundadora y actual presidenta del Patronato.',
  'institucion.mision': '',
  'institucion.misionIcono': 'ti-target-arrow',
  'institucion.vision': '',
  'institucion.visionIcono': 'ti-eye',
  'transparencia.quienesSomos':
    'El Parque Central de Santiago es administrado por el Patronato para la Administración del Parque Central de Santiago, una entidad sin fines de lucro constituida en 2001, resultado del esfuerzo conjunto entre la Asociación para el Desarrollo, Inc. (APEDI) y diecinueve instituciones públicas y privadas de la región. Está registrado bajo la Ley 122-05 del 8 de abril de 2005. RNC: 430-25261-1.',
  'transparencia.marcoNormativo':
    'Ley 122-05 del 8 de abril de 2005, que regula las asociaciones sin fines de lucro en la República Dominicana.',
  'transparencia.usoDonaciones':
    'El detalle sobre el uso de las donaciones recibidas se publicará en una fase posterior del proyecto.',
  'transparencia.codigoEtica':
    'El código de ética institucional se publicará en cuanto el Parque lo confirme.',
  'reserva.calendarioTexto':
    'Todas las actividades programadas del parque están disponibles en la sección de Actividades.',
}

/** Solo dígitos, para armar los enlaces de teléfono y WhatsApp. */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

/**
 * Devuelve una función para leer los textos del sitio por su clave, con
 * respaldo al valor por defecto.
 */
export function useTextos() {
  const { data } = useApiData(api.getTextos)

  const mapa = new Map<string, string>()
  for (const t of data ?? []) {
    if (t.valor.trim()) mapa.set(t.clave, t.valor)
  }

  return (clave: string): string => mapa.get(clave) ?? RESPALDO[clave] ?? ''
}
