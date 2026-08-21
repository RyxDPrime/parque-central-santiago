import { useEffect, useMemo, useState } from 'react'
import {
  cambiarEstadoSolicitud,
  eliminarSolicitud,
  listSolicitudes,
  type SolicitudReserva,
} from './adminClient'

const fechaHora = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/** "2026-09-14" -> "lunes 14 de septiembre". */
function fechaLarga(iso: string): string {
  const f = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(f.getTime())) return iso
  return f.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })
}

const ESTADOS: Record<string, { etiqueta: string; clase: string; icono: string }> = {
  pendiente: { etiqueta: 'Pendiente', clase: 'is-warn', icono: 'ti-clock' },
  aprobada: { etiqueta: 'Aprobada', clase: 'is-ok', icono: 'ti-check' },
  rechazada: { etiqueta: 'Rechazada', clase: 'is-no', icono: 'ti-x' },
  cancelada: { etiqueta: 'Cancelada', clase: 'is-off', icono: 'ti-ban' },
}

/**
 * Bandeja de solicitudes de reserva.
 *
 * Cada solicitud tiene un estado visible, y esa es la pieza que hace que
 * cualquiera del equipo sepa en qué va un caso sin preguntarle a nadie. Las
 * pendientes se muestran primero: son las únicas que piden una decisión.
 *
 * Aprobar o rechazar aquí NO le escribe todavía a quien solicitó; el correo de
 * respuesta se manda desde el botón de responder. Se dice explícitamente en la
 * pantalla para que nadie dé por hecho que la persona ya se enteró.
 */
export function SolicitudesInbox() {
  const [items, setItems] = useState<SolicitudReserva[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('pendiente')

  useEffect(() => {
    listSolicitudes()
      .then((d) => {
        setItems(d)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [])

  async function cambiar(s: SolicitudReserva, estado: string) {
    let motivo: string | undefined
    if (estado === 'rechazada') {
      const escrito = window.prompt(
        'Motivo del rechazo (queda guardado y sirve para redactarle la respuesta):',
        s.motivo ?? '',
      )
      if (escrito === null) return
      motivo = escrito
    }
    try {
      const actualizada = await cambiarEstadoSolicitud(s.id, estado, motivo)
      setItems((prev) => prev.map((x) => (x.id === s.id ? actualizada : x)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  async function borrar(id: number) {
    if (!window.confirm('¿Eliminar esta solicitud? No se puede deshacer.')) return
    try {
      await eliminarSolicitud(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
    }
  }

  const pendientes = items.filter((x) => x.estado === 'pendiente').length

  const visibles = useMemo(() => {
    let r = items
    const q = busqueda.trim().toLowerCase()
    if (q) {
      r = r.filter((x) =>
        [x.nombre, x.email, x.cedula, x.espacio, x.tipoActividad, x.institucion].some((v) =>
          (v ?? '').toLowerCase().includes(q),
        ),
      )
    }
    if (filtroEstado) r = r.filter((x) => x.estado === filtroEstado)
    // Las pendientes arriba: son las que esperan que alguien haga algo.
    return [...r].sort((a, b) => {
      if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1
      if (b.estado === 'pendiente' && a.estado !== 'pendiente') return 1
      return a.fecha.localeCompare(b.fecha)
    })
  }, [items, busqueda, filtroEstado])

  const hayFiltros = Boolean(busqueda.trim()) || Boolean(filtroEstado)

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-calendar-plus" />
        </div>
        <div>
          <h1>Solicitudes de reserva</h1>
          <p>
            Lo que llega desde la página de Reserva. Nada está apartado hasta que alguien aquí lo
            apruebe.
          </p>
        </div>
      </header>

      {pendientes > 0 && (
        <p className="admin-warning">
          <i className="ti ti-clock" />
          {pendientes === 1
            ? 'Hay 1 solicitud esperando respuesta.'
            : `Hay ${pendientes} solicitudes esperando respuesta.`}
        </p>
      )}

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Solicitudes</h2>
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
                placeholder="Buscar por nombre, cédula, espacio…"
                aria-label="Buscar solicitudes"
              />
            </div>

            <label className="admin-toolbar-campo">
              <span>Estado</span>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todas</option>
                {Object.entries(ESTADOS).map(([valor, e]) => (
                  <option key={valor} value={valor}>
                    {e.etiqueta}
                  </option>
                ))}
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

        {cargando && <p className="admin-panel-msg">Cargando…</p>}
        {error && <p className="admin-panel-msg is-error">{error}</p>}

        {!cargando && !error && items.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-calendar-off" />
            <h3>Todavía no hay solicitudes</h3>
            <p>Aquí aparecerá lo que envíen desde la página de Reserva del sitio.</p>
          </div>
        )}

        {!cargando && !error && items.length > 0 && visibles.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-search-off" />
            <h3>Ninguna coincide</h3>
            <p>Prueba con otra búsqueda o quita los filtros.</p>
          </div>
        )}

        {!cargando && !error && visibles.length > 0 && (
          <ul className="inbox-list">
            {visibles.map((s) => {
              const estado = ESTADOS[s.estado] ?? ESTADOS.pendiente
              return (
                <li
                  className={`inbox-item solicitud${s.estado === 'pendiente' ? ' sin-leer' : ''}`}
                  key={s.id}
                >
                  <div className="inbox-item-head">
                    <div>
                      <h3>
                        <i className="ti ti-map-pin" /> {s.espacio}
                      </h3>
                      <p className="inbox-from">
                        {s.nombre} · <a href={`mailto:${s.email}`}>{s.email}</a> · {s.telefono}
                      </p>
                    </div>
                    <div className="inbox-item-meta">
                      <span className={`admin-chip ${estado.clase}`}>
                        <i className={`ti ${estado.icono}`} /> {estado.etiqueta}
                      </span>
                      <span className="inbox-date">
                        Pedida el {fechaHora.format(new Date(s.createdAt))}
                      </span>
                    </div>
                  </div>

                  <dl className="solicitud-datos">
                    <div>
                      <dt>Cuándo</dt>
                      <dd>
                        {fechaLarga(s.fecha)}, {s.horaInicio} a {s.horaFin}
                      </dd>
                    </div>
                    <div>
                      <dt>Actividad</dt>
                      <dd>{s.tipoActividad}</dd>
                    </div>
                    <div>
                      <dt>Personas</dt>
                      <dd>{s.personas}</dd>
                    </div>
                    <div>
                      <dt>Cédula</dt>
                      <dd>{s.cedula}</dd>
                    </div>
                    {s.institucion && (
                      <div>
                        <dt>Institución</dt>
                        <dd>{s.institucion}</dd>
                      </div>
                    )}
                    {s.requerimientos && (
                      <div>
                        <dt>Requiere</dt>
                        <dd>{s.requerimientos}</dd>
                      </div>
                    )}
                  </dl>

                  <p className="inbox-body">{s.descripcion}</p>

                  {s.motivo && (
                    <p className="solicitud-motivo">
                      <i className="ti ti-message-circle" /> Motivo registrado: {s.motivo}
                    </p>
                  )}

                  <div className="inbox-actions">
                    {s.estado !== 'aprobada' && (
                      <button
                        type="button"
                        className="btn-outline es-aprobar"
                        onClick={() => cambiar(s, 'aprobada')}
                      >
                        <i className="ti ti-check" /> Aprobar
                      </button>
                    )}
                    {s.estado !== 'rechazada' && (
                      <button
                        type="button"
                        className="btn-outline es-rechazar"
                        onClick={() => cambiar(s, 'rechazada')}
                      >
                        <i className="ti ti-x" /> Rechazar
                      </button>
                    )}
                    {s.estado === 'aprobada' && (
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => cambiar(s, 'cancelada')}
                      >
                        <i className="ti ti-ban" /> Cancelar
                      </button>
                    )}
                    <a
                      className="btn-outline"
                      href={`mailto:${s.email}?subject=${encodeURIComponent(
                        `Tu solicitud de reserva - ${s.espacio}`,
                      )}`}
                    >
                      <i className="ti ti-corner-up-left" /> Responderle
                    </a>
                    <button type="button" className="inbox-delete" onClick={() => borrar(s.id)}>
                      <i className="ti ti-trash" /> Eliminar
                    </button>
                  </div>

                  {/* Marcar el estado no le avisa a nadie. Decirlo evita que una
                      solicitud quede aprobada en el panel y la persona sin saberlo. */}
                  <p className="solicitud-recordatorio">
                    <i className="ti ti-info-circle" /> Cambiar el estado no le escribe a la
                    persona. Usa <strong>Responderle</strong> para avisarle.
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
