import { useEffect, useMemo, useState } from 'react'
import { deleteMessage, listMessages, type ContactMessage } from './adminClient'

const fechaFormatter = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function MessagesInbox() {
  const [mensajes, setMensajes] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [orden, setOrden] = useState<'recientes' | 'antiguos' | 'nombre'>('recientes')

  useEffect(() => {
    listMessages()
      .then((data) => {
        setMensajes(data)
        setError(null)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar este mensaje?')) return
    try {
      await deleteMessage(id)
      setMensajes((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const sinEnviar = mensajes.filter((m) => !m.emailEnviado).length

  const visibles = useMemo(() => {
    let r = mensajes
    const q = busqueda.trim().toLowerCase()
    if (q) {
      r = r.filter((m) =>
        [m.nombre, m.email, m.telefono, m.asunto, m.mensaje]
          .some((v) => (v ?? '').toLowerCase().includes(q)),
      )
    }
    if (filtroEstado === 'notificado') r = r.filter((m) => m.emailEnviado)
    if (filtroEstado === 'sin_notificar') r = r.filter((m) => !m.emailEnviado)

    return [...r].sort((a, b) => {
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return orden === 'recientes' ? tb - ta : ta - tb
    })
  }, [mensajes, busqueda, filtroEstado, orden])

  const hayFiltros = Boolean(busqueda.trim()) || Boolean(filtroEstado)

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-mail" />
        </div>
        <div>
          <h1>Mensajes de contacto</h1>
          <p>Los mensajes que envían los visitantes desde el formulario del sitio.</p>
        </div>
      </header>

      {sinEnviar > 0 && (
        <p className="admin-warning">
          <i className="ti ti-alert-triangle" />
          {sinEnviar === 1
            ? 'Hay 1 mensaje que no se pudo notificar por correo. Revísalo aquí.'
            : `Hay ${sinEnviar} mensajes que no se pudieron notificar por correo. Revísalos aquí.`}
        </p>
      )}

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Recibidos</h2>
          <span className="admin-count">
            {hayFiltros ? `${visibles.length} de ${mensajes.length}` : mensajes.length}
          </span>
        </div>

        {!loading && !error && mensajes.length > 0 && (
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="ti ti-search" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, correo, asunto o texto…"
                aria-label="Buscar mensajes"
              />
            </div>

            <label className="admin-toolbar-campo">
              <span>Estado</span>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="notificado">Notificados</option>
                <option value="sin_notificar">Sin notificar</option>
              </select>
            </label>

            <label className="admin-toolbar-campo">
              <span>Ordenar por</span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as typeof orden)}
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="nombre">Nombre</option>
              </select>
            </label>

            {hayFiltros && (
              <button
                type="button"
                className="admin-limpiar"
                onClick={() => {
                  setBusqueda('')
                  setFiltroEstado('')
                }}
              >
                <i className="ti ti-x" /> Limpiar
              </button>
            )}
          </div>
        )}

        {loading && <p className="admin-panel-msg">Cargando…</p>}
        {error && <p className="admin-panel-msg is-error">{error}</p>}

        {!loading && !error && mensajes.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-mail-off" />
            <h3>Todavía no hay mensajes</h3>
            <p>Aquí aparecerán los mensajes enviados desde la página de Contacto.</p>
          </div>
        )}

        {!loading && !error && mensajes.length > 0 && visibles.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-search-off" />
            <h3>Ningún mensaje coincide</h3>
            <p>Prueba con otra búsqueda o quita los filtros.</p>
          </div>
        )}

        {!loading && !error && visibles.length > 0 && (
          <ul className="inbox-list">
            {visibles.map((m) => (
              <li className="inbox-item" key={m.id}>
                <div className="inbox-item-head">
                  <div>
                    <h3>{m.asunto?.trim() || 'Sin asunto'}</h3>
                    <p className="inbox-from">
                      {m.nombre} · <a href={`mailto:${m.email}`}>{m.email}</a>
                      {m.telefono && <> · {m.telefono}</>}
                    </p>
                  </div>
                  <div className="inbox-item-meta">
                    <span className="inbox-date">
                      {fechaFormatter.format(new Date(m.createdAt))}
                    </span>
                    {m.emailEnviado ? (
                      <span className="admin-chip is-ok">
                        <i className="ti ti-check" /> Notificado
                      </span>
                    ) : (
                      <span className="admin-chip is-warn">
                        <i className="ti ti-alert-triangle" /> Sin notificar
                      </span>
                    )}
                  </div>
                </div>

                <p className="inbox-body">{m.mensaje}</p>

                <div className="inbox-actions">
                  <a
                    className="btn-outline"
                    href={`mailto:${m.email}?subject=${encodeURIComponent(
                      `Re: ${m.asunto?.trim() || 'Tu mensaje al Parque Central de Santiago'}`,
                    )}`}
                  >
                    <i className="ti ti-corner-up-left" /> Responder
                  </a>
                  <button
                    type="button"
                    className="inbox-delete"
                    onClick={() => handleDelete(m.id)}
                  >
                    <i className="ti ti-trash" /> Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
