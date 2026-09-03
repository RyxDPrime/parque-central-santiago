/**
 * Cuándo hay que preguntarle a quien aporta de dónde salió el dinero.
 *
 * El umbral lo fija el Parque con su asesor legal, no nosotros, así que sale
 * del panel; aquí solo está la regla que lo aplica.
 */

/**
 * Lee el umbral tal como se escribe en el panel: "25000", "RD$ 25,000" o
 * "25.000" son el mismo número. Lo que no se pueda leer como cifra positiva
 * cuenta como cero, y en cero se le pregunta a todo el mundo — que es el lado
 * seguro de equivocarse.
 */
export function umbralDe(valor: string | null | undefined): number {
  const digitos = (valor ?? "").replace(/\D/g, "");
  const numero = Number(digitos);
  return Number.isFinite(numero) && numero > 0 ? numero : 0;
}

export interface AporteAValorar {
  tipo: string;
  monto?: number | null;
}

/**
 * Un patrocinio institucional declara siempre, sin importar el monto: por
 * definición viene de una empresa y suele ser la cifra grande. Un aporte en
 * dinero, solo desde el umbral. El voluntariado nunca: no hay fondos que
 * declarar.
 */
export function debeDeclarar(aporte: AporteAValorar, umbral: number): boolean {
  if (aporte.tipo === "patrocinio") return true;
  return aporte.tipo === "dinero" && (aporte.monto ?? 0) >= umbral;
}
