import { type FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileDropzone } from './FileDropzone'
import { listEntity, updateEntity, uploadFile } from './adminClient'
import { fotoSecciones } from './entityConfigs'
import type { EncabezadoPagina } from '../api/client'

const ENCUADRES = [
  { value: 'center', label: 'Centrado' },
  { value: 'center 20%', label: 'Hacia arriba' },
  { value: 'top', label: 'Borde superior' },
  { value: 'center 80%', label: 'Hacia abajo' },
  { value: 'bottom', label: 'Borde inferior' },
]

/**
 * Pantalla dedicada a la foto de un bloque concreto del sitio.
 *
 * Las fotos se guardan todas en la misma tabla que las franjas de encabezado,
 * pero algunas pertenecen a un bloque con nombre propio ("Quiénes somos") y
 * buscarlas entre diecisiete filas de banners no es razonable: aquí se edita
 * directamente la que corresponde, sin lista intermedia.
 */
export function FotoSeccion() {
  const { clave } = useParams<{ clave: string }>()
  const config = fotoSecciones.find((f) => f.clave === clave)

  const [registro, setRegistro] = useState<EncabezadoPagina | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guardado, setGuardado] = useState(false)
  // Remonta el formulario tras guardar: es lo único que limpia de verdad el
  // campo de archivo y su vista previa.
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!clave) return
    setCargando(true)
    listEntity<EncabezadoPagina>('encabezados')
      .then((todos) => {
        setRegistro(todos.find((e) => e.clave === clave) ?? null)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [clave])

  if (!config) return <p>Sección no encontrada.</p>

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!registro) return
    const formulario = event.currentTarget
    setGuardando(true)
    setError(null)
    setGuardado(false)
    try {
      const datos = new FormData(formulario)
      const archivo = datos.get('imagenUrl') as File | null

      let imagenUrl = registro.imagenUrl
      if (archivo && archivo.size > 0) {
        imagenUrl = await uploadFile(archivo)
      } else if (datos.get('imagenUrl__quitar')) {
        imagenUrl = ''
      }

      setRegistro(
        await updateEntity<EncabezadoPagina>('encabezados', registro.id, {
          imagenUrl,
          posicion: String(datos.get('posicion') ?? 'center'),
        }),
      )
      setGuardado(true)
      setVersion((v) => v + 1)
      setTimeout(() => setGuardado(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className={`ti ${config.icon}`} />
        </div>
        <div>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
        </div>
      </header>

      {cargando && <p className="admin-panel-msg">Cargando…</p>}
      {error && (
        <p className="form-feedback error" style={{ marginBottom: 20 }}>
          <i className="ti ti-alert-circle" /> {error}
        </p>
      )}
      {!cargando && !registro && (
        <p className="admin-panel-msg">
          Todavía no existe esta foto en la base de datos. Avisa a quien administra el sitio.
        </p>
      )}

      {registro && (
        <form className="admin-form is-editing" onSubmit={guardar} key={version}>
          <div className="admin-form-head">
            <span className="admin-form-badge">
              <i className="ti ti-photo" />
            </span>
            <div>
              <h2>Foto de {config.label}</h2>
              <p>Se ve al instante en el sitio, sin necesidad de publicar nada más.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field admin-field-wide">
              <label htmlFor="imagenUrl">Foto</label>
              <FileDropzone
                name="imagenUrl"
                accept="image/*"
                aspect={config.aspect}
                currentFileLabel={registro.imagenUrl ? registro.imagenUrl.split('/').pop() : null}
                currentFileUrl={registro.imagenUrl || null}
                permiteQuitar
              />
            </div>

            <div className="admin-field">
              <label htmlFor="posicion">Encuadre vertical</label>
              <select id="posicion" name="posicion" defaultValue={registro.posicion}>
                {ENCUADRES.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
              <small className="admin-field-hint">
                Qué parte de la foto se ve cuando es más alta que el recuadro.
              </small>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn-primary" disabled={guardando}>
              <i className="ti ti-device-floppy" /> {guardando ? 'Guardando…' : 'Guardar'}
            </button>
            {guardado && (
              <span className="texto-guardado">
                <i className="ti ti-check" /> Guardado
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
