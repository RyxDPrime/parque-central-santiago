/**
 * Dónde cae cada fila cuando se crea, se mueve o se borra.
 *
 * La posición se mantiene siempre como una secuencia 1..n sin huecos ni
 * repetidos. Las cuentas están aquí, separadas de las consultas que las
 * ejecutan, porque equivocarse en un `>=` deja el listado del panel en un orden
 * que nadie entiende y que además ya no se puede arreglar arrastrando.
 */

/** Solo vale una posición entera y positiva; cualquier otra cosa es "no pidió". */
export function posicionPedida(valor: unknown): number | null {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

/**
 * Al crear: sin posición explícita va al final, y si la piden fuera de rango se
 * ajusta al final para no dejar huecos. `total` es cuántas filas había antes.
 */
export function posicionAlCrear(pedida: number | null, total: number): number {
  return pedida === null ? total + 1 : Math.min(pedida, total + 1);
}

export interface Movimiento {
  /** La posición en la que acaba la fila. */
  hasta: number;
  /**
   * Qué le pasa a las de en medio: al subir una fila, las que estaban entre su
   * destino y su origen bajan un puesto; al bajarla, las de en medio suben.
   * `null` cuando se queda donde estaba y no hay que correr a nadie.
   */
  direccion: "bajan" | "suben" | null;
}

/** Al mover: `desde` es donde está, `pedida` a dónde la mandan, `total` cuántas hay. */
export function movimiento(desde: number, pedida: number, total: number): Movimiento {
  const hasta = Math.min(pedida, total);
  if (hasta < desde) return { hasta, direccion: "bajan" };
  if (hasta > desde) return { hasta, direccion: "suben" };
  return { hasta, direccion: null };
}
