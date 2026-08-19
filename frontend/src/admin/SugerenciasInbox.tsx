import { useEffect, useMemo, useState } from 'react'
import {
  deleteSugerencia,
  listSugerencias,
  marcarSugerenciaLeida,
  type Sugerencia,
} from './adminClient'

const fechaFormatter = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** Los mismos cuatro tipos que ofrece el formulario del sitio. */
const TIPOS: Record<string, { etiqueta: string; icono: string }> = {
  sugerencia: { etiqueta: 'Sugerencia', icono: 'ti-bulb' },
  felicitacion: { etiqueta: 'Felicitación', icono: 'ti-mood-happy' },
  queja: { etiqueta: 'Queja', icono: 'ti-alert-triangle' },
  otro: { etiqueta: 'Comunicación', icono: 'ti-message-2' },
}

/**
 * Bandeja de lo que llega desde la página de Sugerencias.
 *
 * Va aparte de los mensajes de contacto porque se atiende distinto: aquí no
 * suele haber que responder de inmediato, sino leer y tomar nota, y por eso
 * cada mensaje se puede marcar como leído.
 */
export function SugerenciasInbox() {
  const [items, setItems] = useState<Sugerencia[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  useEffect(() => {
    listSugerencias()
      .then((d) => {
        setItems(d)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [])

  async function alternarLeida(s: Sugerencia) {
    try {
      const actualizada = await marcarSugerenciaLeida(s.id, !s.leida)
      setItems((prev) => prev.map((x) => (x.id === s.id ? actualizada : x)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  async function eliminar(id: number) {
    if (!window.confirm('¿Eliminar este mensaje?')) return
    try {
      await deleteSugerencia(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
    }
  }

  const sinLeer = items.filter((x) => !x.leida).length
  const sinNotificar = items.filter((x) => !x.emailEnviado).length

  const visibles = useMemo(() => {
    let r = items
    const q = busqueda.trim().toLowerCase()
    if (q) {
      r = r.filter((x) =>
        [x.nombre, x.email, x.telefono, x.mensaje].some((v) =>
          (v ?? '').toLowerCase().includes(q),
        ),
      )
    }
    if (filtroTipo) r = r.filter((x) => x.tipo === filtroTipo)
    if (filtroEstado === 'sin_leer') r = r.filter((x) => !x.leida)
    if (filtroEstado === 'leidas') r = r.filter((x) => x.leida)
    return r
  }, [items, busqueda, filtroTipo, filtroEstado])

  const hayFiltros = Boolean(busqueda.trim()) || Boolean(filtroTipo) || Boolean(filtroEstado)

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-bulb" />
        </div>
        <div>
          <h1>Sugerencias y comunicaciones</h1>
          <p>Lo que los visitantes envían desde la página de Sugerencias del sitio.</p>
        </div>
      </header>

      {sinNotificar > 0 && (
        <p className="admin-warning">
          <i className="ti ti-alert-triangle" />
          {sinNotificar === 1
            ? 'Hay 1 mensaje que no se pudo notificar por correo. Está guardado aquí.'
            : `Hay ${sinNotificar} mensajes que no se pudieron notificar por correo. Están guardados aquí.`}
        </p>
      )}

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Recibidos{sinLeer > 0 ? ` · ${sinLeer} sin leer` : ''}</h2>
          <span className="admin-count">
            {hayFiltros ? `${visibles.length} de ${items.length}` : items.length}
          </span>
        </div>

        {!cargando && !error && items.length > 0 && (
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="ti ti-search" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, correo o texto…"
                aria-label="Buscar sugerencias"
              />
            </div>

            <label className="admin-toolbar-campo">
              <span>Tipo</span>
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(TIPOS).map(([valor, t]) => (
                  <option key={valor} value={valor}>
                    {t.etiqueta}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-toolbar-campo">
              <span>Estado</span>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="sin_leer">Sin leer</option>
                <option value="leidas">Leídas</option>
              </select>
            </label>

            {hayFiltros && (
              <button
                type="button"
                className="admin-limpiar"
                onClick={() => {
                  setBusqueda('')
                  setFiltroTipo('')
                  setFiltroEstado('')
                }}
              >
                <i className="ti ti-x" /> Limpiar
              </button>
            )}
          </div>
        )}

        {cargando && <p className="admin-panel-msg">Cargando…</p>}
        {error && <p className="admin-panel-msg is-error">{error}</p>}

        {!cargando && !error && items.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-message-off" />
            <h3>Todavía no hay mensajes</h3>
            <p>Aquí aparecerá lo que envíen desde la página de Sugerencias.</p>
          </div>
        )}

        {!cargando && !error && items.length > 0 && visibles.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-search-off" />
            <h3>Ninguno coincide</h3>
            <p>Prueba con otra búsqueda o quita los filtros.</p>
          </div>
        )}

        {!cargando && !error && visibles.length > 0 && (
          <ul className="inbox-list">
            {visibles.map((s) => {
              const tipo = TIPOS[s.tipo] ?? TIPOS.otro
              return (
                <li className={`inbox-item${s.leida ? '' : ' sin-leer'}`} key={s.id}>
                  <div className="inbox-item-head">
                    <div>
                      <h3>
                        <i className={`ti ${tipo.icono}`} /> {tipo.etiqueta}
                      </h3>
                      <p className="inbox-from">
                        {s.nombre} · <a href={`mailto:${s.email}`}>{s.email}</a>
                        {s.telefono && <> · {s.telefono}</>}
                      </p>
                    </div>
                    <div className="inbox-item-meta">
                      <span className="inbox-date">
                        {fechaFormatter.format(new Date(s.createdAt))}
                      </span>
                      {s.leida ? (
                        <span className="admin-chip is-ok">
                          <i className="ti ti-check" /> Leída
                        </span>
                      ) : (
                        <span className="admin-chip is-warn">Sin leer</span>
                      )}
                    </div>
                  </div>

                  <p className="inbox-body">{s.mensaje}</p>

                  <div className="inbox-actions">
                    <a
                      className="btn-outline"
                      href={`mailto:${s.email}?subject=${encodeURIComponent(
                        `Re: tu mensaje al Parque Central de Santiago`,
                      )}`}
                    >
                      <i className="ti ti-corner-up-left" /> Responder
                    </a>
                    <button type="button" className="btn-outline" onClick={() => alternarLeida(s)}>
                      <i className={`ti ${s.leida ? 'ti-mail' : 'ti-check'}`} />
                      {s.leida ? ' Marcar sin leer' : ' Marcar como leída'}
                    </button>
                    <button type="button" className="inbox-delete" onClick={() => eliminar(s.id)}>
                      <i className="ti ti-trash" /> Eliminar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
