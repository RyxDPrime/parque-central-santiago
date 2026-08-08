import { type FormEvent, useEffect, useState } from 'react'
import { listEntity, updateEntity } from './adminClient'
import type { Texto } from '../api/client'

/**
 * Editor de los textos sueltos del sitio. A diferencia de las demás secciones,
 * aquí no se crean ni se borran registros: las claves son fijas y solo cambia
 * su contenido. Se agrupan por la parte del sitio a la que pertenecen.
 */
export function TextosEditor() {
  const [textos, setTextos] = useState<Texto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState<number | null>(null)
  const [guardado, setGuardado] = useState<number | null>(null)

  useEffect(() => {
    listEntity<Texto>('textos')
      .then((d) => {
        setTextos(d)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  async function guardar(event: FormEvent<HTMLFormElement>, texto: Texto) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const valor = String(form.get('valor') ?? '')

    setGuardando(texto.id)
    setGuardado(null)
    try {
      const actualizado = await updateEntity<Texto>('textos', texto.id, { valor })
      setTextos((prev) => prev.map((t) => (t.id === texto.id ? actualizado : t)))
      setGuardado(texto.id)
      // El aviso de guardado se retira solo, para no dejarlo fijo en pantalla.
      setTimeout(() => setGuardado((actual) => (actual === texto.id ? null : actual)), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setGuardando(null)
    }
  }

  const grupos = [...new Set(textos.map((t) => t.grupo))]

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-text-caption" />
        </div>
        <div>
          <h1>Textos del sitio</h1>
          <p>
            Textos que aparecen dentro de las páginas: datos de contacto, horarios y párrafos
            institucionales. Cada uno se guarda por separado.
          </p>
        </div>
      </header>

      {loading && <p className="admin-panel-msg">Cargando…</p>}
      {error && (
        <p className="form-feedback error" style={{ marginBottom: 20 }}>
          <i className="ti ti-alert-circle" /> {error}
        </p>
      )}

      {!loading &&
        grupos.map((grupo) => (
          <section className="admin-panel" key={grupo} style={{ marginBottom: 20 }}>
            <div className="admin-panel-head">
              <h2>{grupo}</h2>
              <span className="admin-count">{textos.filter((t) => t.grupo === grupo).length}</span>
            </div>

            {textos
              .filter((t) => t.grupo === grupo)
              .map((texto) => (
                <form className="texto-fila" key={texto.id} onSubmit={(e) => guardar(e, texto)}>
                  <div className="admin-field">
                    <label htmlFor={`texto-${texto.id}`}>{texto.etiqueta}</label>
                    {texto.multiline ? (
                      <textarea
                        id={`texto-${texto.id}`}
                        name="valor"
                        defaultValue={texto.valor}
                        rows={4}
                      />
                    ) : (
                      <input id={`texto-${texto.id}`} name="valor" type="text" defaultValue={texto.valor} />
                    )}
                  </div>
                  <div className="texto-fila-acciones">
                    <button type="submit" className="btn-primary" disabled={guardando === texto.id}>
                      <i className="ti ti-device-floppy" />
                      {guardando === texto.id ? 'Guardando…' : 'Guardar'}
                    </button>
                    {guardado === texto.id && (
                      <span className="texto-guardado">
                        <i className="ti ti-check" /> Guardado
                      </span>
                    )}
                  </div>
                </form>
              ))}
          </section>
        ))}
    </div>
  )
}
