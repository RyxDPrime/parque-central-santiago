/**
 * Las reglas de cuándo dos reservas se estorban.
 *
 * Viven aquí y no dentro de la ruta para poder comprobarlas sin levantar un
 * servidor ni una base: son decisiones, y una decisión que nadie puede
 * ejercitar por separado es una que solo se prueba en producción.
 */

export interface Franja {
  horaInicio: string;
  horaFin: string;
}

/**
 * Dos franjas del mismo día se pisan cuando cada una empieza antes de que la
 * otra termine. Que una empiece justo cuando la otra acaba no es choque: a las
 * 12:00 sale una actividad y entra la siguiente.
 *
 * Las horas se comparan como texto porque van guardadas en "HH:MM" con el cero
 * delante, y en ese formato el orden alfabético es el orden del reloj.
 */
export function seSolapan(a: Franja, b: Franja): boolean {
  return a.horaInicio < b.horaFin && a.horaFin > b.horaInicio;
}

/**
 * Cuántas reservas admite un espacio a la vez. Con `cantidad` (ocho kioscos
 * grandes) son tantas como unidades tenga; sin ese dato, una sola.
 */
export function cupoDe(cantidad: number | null | undefined): number {
  return typeof cantidad === "number" && cantidad > 0 ? cantidad : 1;
}

/** De lo ya apartado, lo que se pisa con la franja pedida. */
export function choquesCon<T extends Franja>(franja: Franja, apartadas: readonly T[]): T[] {
  return apartadas.filter((otra) => seSolapan(franja, otra));
}

/** Queda sitio mientras lo que choca no llegue al cupo. */
export function hayCupo(choques: number, cupo: number): boolean {
  return choques < cupo;
}
