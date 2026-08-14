const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

/** Dominio donde vive el backend, que es quien sirve los archivos subidos. */
export const ORIGEN_BACKEND = new URL(API_URL, window.location.origin).origin;

/**
 * Rutas de los archivos subidos desde el panel.
 *
 * En la base de datos se guardan siempre relativas (`/uploads/foto.jpg`), no
 * con el dominio delante. Eso es a propósito: el backend y el frontend viven en
 * dominios distintos y ese dominio puede cambiar —al mudar de proveedor, al
 * poner el dominio propio del parque—, y si quedara escrito dentro de cada
 * fila, todas las fotos guardadas apuntarían a un servidor que ya no existe.
 *
 * El dominio se le pone al leer y se le quita al guardar, en un solo sitio, de
 * modo que el resto del código sigue trabajando con URLs completas.
 */
export function aAbsoluta(valor: string): string {
  return valor.startsWith("/uploads/") ? `${ORIGEN_BACKEND}${valor}` : valor;
}

export function aRelativa(valor: string): string {
  return valor.startsWith(`${ORIGEN_BACKEND}/uploads/`)
    ? valor.slice(ORIGEN_BACKEND.length)
    : valor;
}

/**
 * Recorre lo que devuelve o recibe la API y convierte las rutas de archivos.
 * Devuelve una copia; no toca el valor original.
 */
export function convertirMedios<T>(dato: T, convertir: (valor: string) => string): T {
  if (typeof dato === "string") return convertir(dato) as T;
  if (Array.isArray(dato)) return dato.map((x) => convertirMedios(x, convertir)) as T;
  if (dato && typeof dato === "object") {
    const salida: Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(dato)) {
      salida[clave] = convertirMedios(valor, convertir);
    }
    return salida as T;
  }
  return dato;
}
