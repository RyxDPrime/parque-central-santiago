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
    'Un espacio para la recreación, el deporte, la cultura y la convivencia ciudadana, administrado por el Patronato para la Administración del Parque Central de Santiago desde 2018.',
  'historia.apedi':
    'El Parque Central de Santiago mantiene una estrecha relación con la Asociación para el Desarrollo, Inc. (APEDI), institución fundadora y actual presidenta del Patronato.',
  'transparencia.quienesSomos':
    'El Parque Central de Santiago es administrado por el Patronato para la Administración del Parque Central de Santiago, una entidad sin fines de lucro constituida el 6 de abril de 2018.',
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
