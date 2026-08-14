import { useApiData } from './useApiData'
import { api } from '../api/client'

interface Encabezado {
  /**
   * `true` cuando la clave existe en la base. Manda lo guardado aunque la foto
   * esté vacía: dejarla en blanco desde el panel es una decisión (franja verde
   * sola), no una falta de configuración.
   */
  configurado: boolean
  imagen?: string
  posicion?: string
}

/**
 * Foto de encabezado de una página, editable desde el panel.
 *
 * Si la clave todavía no existe o el servidor no responde, quien llama usa la
 * foto que trae por defecto, así la franja nunca queda vacía por un error.
 */
export function useEncabezado(clave: string | undefined): Encabezado {
  const { data } = useApiData(api.getEncabezados)

  if (!clave || !data) return { configurado: false }
  const encontrado = data.find((e) => e.clave === clave)
  if (!encontrado) return { configurado: false }

  return {
    configurado: true,
    imagen: encontrado.imagenUrl || undefined,
    posicion: encontrado.posicion,
  }
}
