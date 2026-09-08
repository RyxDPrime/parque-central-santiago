import type { FormaApoyo, TipoAporte } from './client'

/**
 * A qué opción del formulario de aportes lleva cada forma de apoyo.
 *
 * Se deduce de la etiqueta que el Parque le puso, que es justo el campo que la
 * clasifica. Sin esto, «Ser voluntario» y «Hacer una donación» llevaban al mismo
 * sitio y abrían los dos en la opción de dinero: quien venía a ofrecer horas
 * tenía que darse cuenta solo de que había que cambiarla.
 *
 * Si mañana renombran la etiqueta y deja de coincidir, el botón sigue llevando
 * al formulario, solo que sin nada preseleccionado. Es un fallo que no rompe
 * nada, y por eso se prefiere a obligar al Parque a mantener un campo más.
 *
 * Vive aquí y no dentro de una página porque lo usan dos: la de Apóyanos y la
 * franja de la portada, que tienen que coincidir.
 */
export function tipoDeApoyo(forma: Pick<FormaApoyo, 'etiqueta' | 'titulo'>): TipoAporte | null {
  const texto = `${forma.etiqueta} ${forma.titulo}`.toLowerCase()
  if (texto.includes('volunt')) return 'voluntariado'
  if (texto.includes('patrocin')) return 'patrocinio'
  if (texto.includes('donac') || texto.includes('aporte')) return 'dinero'
  return null
}
