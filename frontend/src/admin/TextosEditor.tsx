import { type FormEvent, useEffect, useState } from 'react'
import { listEntity, updateEntity } from './adminClient'
import type { Texto } from '../api/client'

interface TextosEditorProps {
  /** Grupos a mostrar. Sin esto se muestran todos. */
  grupos?: string[]
  /**
   * Incrustado dentro de otra pantalla: se omiten el encabezado propio y el
   * título de cada grupo, que allí solo repetirían lo que ya dice la página.
   */
  embebido?: boolean
  /** Título del panel cuando va incrustado. */
  titulo?: string
}

/**
 * Editor de los textos sueltos del sitio. A diferencia de las demás secciones,
 * aquí no se crean ni se borran registros: las claves son fijas y solo cambia
 * su contenido.
 *
 * Se usa de dos formas: como pantalla propia para los grupos que no tienen una
 * sección con tabla (contacto, portada), y incrustado dentro de la sección a la
 * que pertenecen los textos, para administrarlos donde se usan.
 */
export function TextosEditor({ grupos, embebido, titulo }: TextosEditorProps = {}) {
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

  const visibles = grupos ? textos.filter((t) => grupos.includes(t.grupo)) : textos
  const gruposVisibles = [...new Set(visibles.map((t) => t.grupo))]

  // Incrustado no vale la pena mostrar nada mientras carga ni si el grupo
  // quedó vacío: la pantalla que lo contiene ya tiene su propio contenido.
  if (embebido && (loading || visibles.length === 0)) return null

  const contenido = (
    <>
      {loading && <p className="admin-panel-msg">Cargando…</p>}
      {error && (
        <p className="form-feedback error" style={{ marginBottom: 20 }}>
          <i className="ti ti-alert-circle" /> {error}
        </p>
      )}

      {!loading &&
        gruposVisibles.map((grupo) => (
          <section className="admin-panel" key={grupo} style={{ marginBottom: 20 }}>
            <div className="admin-panel-head">
              <h2>{embebido ? (titulo ?? 'Textos de esta sección') : grupo}</h2>
              <span className="admin-count">{visibles.filter((t) => t.grupo === grupo).length}</span>
            </div>

            {visibles
              .filter((t) => t.grupo === grupo)
              .map((texto) => (
                <form className="texto-fila" key={texto.id} onSubmit={(e) => guardar(e, texto)}>
                  <div className="admin-field">
                    <label htmlFor={`texto-${texto.id}`}>{texto.etiqueta}</label>
                    {texto.opciones ? (
                      <select id={`texto-${texto.id}`} name="valor" defaultValue={texto.valor}>
                        {texto.opciones.split(',').map((opcion) => {
                          const [valor, etiqueta] = opcion.split(':')
                          return (
                            <option key={valor} value={valor}>
                              {etiqueta ?? valor}
                            </option>
                          )
                        })}
                      </select>
                    ) : texto.multiline ? (
                      <textarea
                        id={`texto-${texto.id}`}
                        name="valor"
                        defaultValue={texto.valor}
                        rows={4}
                      />
                    ) : (
                      <input id={`texto-${texto.id}`} name="valor" type="text" defaultValue={texto.valor} />
                    )}
                    {texto.ayuda && <small className="admin-field-hint">{texto.ayuda}</small>}
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
    </>
  )

  if (embebido) return contenido

  const seccion = gruposVisibles.length === 1 ? gruposVisibles[0] : null

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-text-caption" />
        </div>
        <div>
          <h1>{titulo ?? seccion ?? 'Textos del sitio'}</h1>
          <p>
            Textos que aparecen dentro de las páginas. Cada uno se guarda por separado.
          </p>
        </div>
      </header>

      {contenido}
    </div>
  )
}
