import { useEffect, useState } from 'react'
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
          <span className="admin-count">{mensajes.length}</span>
        </div>

        {loading && <p className="admin-panel-msg">Cargando…</p>}
        {error && <p className="admin-panel-msg is-error">{error}</p>}

        {!loading && !error && mensajes.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-mail-off" />
            <h3>Todavía no hay mensajes</h3>
            <p>Aquí aparecerán los mensajes enviados desde la página de Contacto.</p>
          </div>
        )}

        {!loading && !error && mensajes.length > 0 && (
          <ul className="inbox-list">
            {mensajes.map((m) => (
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
