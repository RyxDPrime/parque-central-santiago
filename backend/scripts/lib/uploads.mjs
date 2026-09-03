// Las cuentas del script que limpia el volumen, aparte de los archivos y de la
// base para poder comprobarlas sin ninguna de las dos cosas.
import path from 'node:path'

/**
 * Las rutas a /uploads/ que menciona un texto. Puede haber varias dentro del
 * mismo valor: el cuerpo de una publicación del blog las lleva incrustadas.
 */
export function rutasDeUploads(texto) {
  return String(texto ?? '').match(/\/uploads\/[^\s"'<>)]+/g) ?? []
}

/** Los nombres de archivo que menciona un conjunto de valores de la base. */
export function nombresReferenciados(valores) {
  const nombres = new Set()
  for (const valor of valores) {
    for (const ruta of rutasDeUploads(valor)) nombres.add(path.basename(ruta))
  }
  return nombres
}

/**
 * De lo que hay en la carpeta, solo los archivos.
 *
 * El volumen trae un directorio `lost+found` que crea el propio sistema de
 * archivos. No lo referencia nadie, así que sin este filtro salía como
 * sobrante, y borrarlo falla por ser directorio: la limpieza se quedaba a
 * medias justo después de haber borrado cosas.
 */
export function soloArchivos(entradas) {
  return entradas.filter((entrada) => entrada.isFile()).map((entrada) => entrada.name)
}

/** Lo que está en la carpeta y no menciona nadie. */
export function sobrantes(archivos, enUso) {
  return archivos.filter((nombre) => !enUso.has(nombre))
}
