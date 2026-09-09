import type { Programa } from './client'

/**
 * Fotos de reserva para los programas que todavía no tienen la suya cargada
 * desde el panel. Son las que el Parque nos pasó al principio, guardadas por
 * nombre; en cuanto suban la suya, esta lista deja de usarse sola.
 *
 * Vive aquí y no dentro de una página porque la usan las dos partes del sitio
 * que muestran programas: la página de Programas y Servicios, y el carrusel de
 * la portada.
 */
const FOTOS_POR_NOMBRE: Record<string, string> = {
  'Cibao Fútbol Club': '/images/galeria/cibao-futbol-club.jpg',
  'Escuela de Tenis – Washington Heights Tennis Association': '/images/galeria/cancha-tenis.jpg',
  Tirolesa: '/images/galeria/vista-aerea-parque.jpg',
  'Fun Stop – Carritos Corredores': '/images/galeria/funstop.jpg',
  'Alquiler de Bicicletas – Bicicentro': '/images/galeria/ciclistas.jpg',
}

/** La foto del panel manda; si no hay, la de reserva; si tampoco, la del parque. */
export function fotoDePrograma(programa: Pick<Programa, 'nombre' | 'fotoUrl'>): string {
  return (
    programa.fotoUrl ||
    FOTOS_POR_NOMBRE[programa.nombre] ||
    '/images/galeria/entrada-parque.jpg'
  )
}
