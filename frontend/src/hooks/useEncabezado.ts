import { useApiData } from './useApiData'
import { api } from '../api/client'

interface Encabezado {
  imagen?: string
  posicion?: string
}

/**
 * Foto de encabezado de una página, editable desde el panel.
 *
 * Devuelve lo guardado en la base de datos; si esa clave todavía no existe o
 * el servidor no responde, quien llama usa la foto que trae por defecto, así
 * la franja nunca queda vacía.
 */
export function useEncabezado(clave: string | undefined): Encabezado {
  const { data } = useApiData(api.getEncabezados)

  if (!clave || !data) return {}
  const encontrado = data.find((e) => e.clave === clave)
  if (!encontrado?.imagenUrl) return {}

  return { imagen: encontrado.imagenUrl, posicion: encontrado.posicion }
}
