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

/** Se guarda en dígitos; se lee mejor con los guiones puestos. */
function cedulaConGuiones(valor: string): string {
  return /^\d{11}$/.test(valor)
    ? `${valor.slice(0, 3)}-${valor.slice(3, 10)}-${valor.slice(10)}`
    : valor
}

const ESTADOS: Record<string, { etiqueta: string; clase: string; icono: string }> = {
  pendiente: { etiqueta: 'Pendiente', clase: 'is-warn', icono: 'ti-clock' },
  aprobada: { etiqueta: 'Aprobada', clase: 'is-ok', icono: 'ti-check' },
  rechazada: { etiqueta: 'Rechazada', clase: 'is-no', icono: 'ti-x' },
  cancelada: { etiqueta: 'Cancelada', clase: 'is-off', icono: 'ti-ban' },
}

/**
 * Una línea, para leer la lista de un vistazo. Lo que hace falta para saber si
 * una solicitud te interesa antes de abrirla: qué espacio, cuándo y para qué.
 */
function resumen(s: SolicitudReserva): string {
  return [
    s.espacio,
    `${fechaLarga(s.fecha)}, ${s.horaInicio}–${s.horaFin}`,
    `${s.personas} ${s.personas === 1 ? 'persona' : 'personas'}`,
    s.tipoActividad,
  ].join(' · ')
}

/**
 * Bandeja de solicitudes de reserva.
 *
 * La lista es deliberadamente corta —nombre, resumen y estado— porque su
 * trabajo es dejar barrer veinte solicitudes en unos segundos. Todo el detalle,
 * y la decisión, viven en la ventana que abre "Ver detalle": decidir con doce
 * datos delante es distinto de decidir con un botón al final de una tarjeta.
 *
 * Aprobar y rechazar SÍ le escriben a quien solicitó, con la plantilla que el
 * Parque tenga guardada en Plantillas de respuesta.
 */
export function SolicitudesInbox() {
  const [items, setItems] = useState<SolicitudReserva[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('pendiente')
  // Lo que se acaba de decidir se queda a la vista aunque deje de cumplir el
  // filtro. Si no, aprobar una solicitud la hace desaparecer sin más y no queda
  // claro si se guardó: la confirmación es verla con su nuevo estado.
  const [recienDecididas, setRecienDecididas] = useState<number[]>([])

  const [abiertaId, setAbiertaId] = useState<number | null>(null)
  const [motivo, setMotivo] = useState('')
  const [avisar, setAvisar] = useState(true)
  const [decidiendo, setDecidiendo] = useState(false)

  const abierta = items.find((x) => x.id === abiertaId) ?? null

  useEffect(() => {
    listSolicitudes()
      .then((d) => {
        setItems(d)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [])

  // Con la ventana abierta, el fondo no debe correr detrás de ella.
  useEffect(() => {
    document.body.style.overflow = abiertaId ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abiertaId])

  useEffect(() => {
    if (!abiertaId) return
    function alPulsar(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abiertaId])

  function abrir(s: SolicitudReserva) {
    setAbiertaId(s.id)
    setMotivo(s.motivo ?? '')
    setAvisar(true)
    setError(null)
  }

  function cerrar() {
    setAbiertaId(null)
    setMotivo('')
  }

  async function decidir(s: SolicitudReserva, estado: string) {
    if (estado === 'rechazada' && !motivo.trim()) {
      setError('Escribe el motivo: es lo que la persona va a leer en el correo.')
      return
    }
    setDecidiendo(true)
    setError(null)
    try {
      const actualizada = await cambiarEstadoSolicitud(s.id, estado, motivo.trim(), avisar)
      setItems((prev) => prev.map((x) => (x.id === s.id ? actualizada : x)))
      setRecienDecididas((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]))
      // Si el correo falló, la ventana se queda abierta: es donde se ve el aviso.
      if (!actualizada.respuestaError) cerrar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setDecidiendo(false)
    }
  }

  async function borrar(id: number) {
    if (!window.confirm('¿Eliminar esta solicitud? No se puede deshacer.')) return
    try {
      await eliminarSolicitud(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
      cerrar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
    }
  }

  const pendientes = items.filter((x) => x.estado === 'pendiente').length
  const sinAvisar = items.filter((x) => x.respuestaError).length

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
    if (filtroEstado) {
      r = r.filter((x) => x.estado === filtroEstado || recienDecididas.includes(x.id))
    }
    // Las pendientes arriba: son las que esperan que alguien haga algo.
    return [...r].sort((a, b) => {
      if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1
      if (b.estado === 'pendiente' && a.estado !== 'pendiente') return 1
      return a.fecha.localeCompare(b.fecha)
    })
  }, [items, busqueda, filtroEstado, recienDecididas])

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

      {sinAvisar > 0 && (
        <p className="admin-warning">
          <i className="ti ti-mail-off" />
          {sinAvisar === 1
            ? 'Hay 1 solicitud decidida cuyo correo no salió. Ábrela y escríbele a mano.'
            : `Hay ${sinAvisar} solicitudes decididas cuyo correo no salió. Ábrelas y escríbeles a mano.`}
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
              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value)
                  setRecienDecididas([])
                }}
              >
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
                  setRecienDecididas([])
                }}
              >
                <i className="ti ti-x" /> Limpiar
              </button>
            )}
          </div>
        )}

        {cargando && <p className="admin-panel-msg">Cargando…</p>}
        {error && !abierta && <p className="admin-panel-msg is-error">{error}</p>}

        {!cargando && items.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-calendar-off" />
            <h3>Todavía no hay solicitudes</h3>
            <p>Aquí aparecerá lo que envíen desde la página de Reserva del sitio.</p>
          </div>
        )}

        {!cargando && items.length > 0 && visibles.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-search-off" />
            <h3>Ninguna coincide</h3>
            <p>Prueba con otra búsqueda o quita los filtros.</p>
          </div>
        )}

        {!cargando && visibles.length > 0 && (
          <ul className="solicitud-lista">
            {visibles.map((s) => {
              const estado = ESTADOS[s.estado] ?? ESTADOS.pendiente
              return (
                <li
                  className={`solicitud-fila${s.estado === 'pendiente' ? ' esta-pendiente' : ''}${
                    recienDecididas.includes(s.id) ? ' recien-decidida' : ''
                  }`}
                  key={s.id}
                >
                  <div className="solicitud-fila-texto">
                    <h3>
                      {s.nombre}
                      {s.institucion && <small> · {s.institucion}</small>}
                    </h3>
                    <p>{resumen(s)}</p>
                  </div>

                  <div className="solicitud-fila-lado">
                    <span className={`admin-chip ${estado.clase}`}>
                      <i className={`ti ${estado.icono}`} /> {estado.etiqueta}
                    </span>
                    {s.respuestaError && (
                      <span className="admin-chip is-no" title={s.respuestaError}>
                        <i className="ti ti-mail-off" /> Sin avisar
                      </span>
                    )}
                    <button type="button" className="btn-outline" onClick={() => abrir(s)}>
                      <i className="ti ti-eye" /> Ver detalle
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ── Ventana de detalle ── */}
      {abierta && (
        <div
          className="modal-fondo"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrar()
          }}
        >
          <div className="modal-caja" role="dialog" aria-modal="true" aria-label="Detalle de la solicitud">
            <header className="modal-cabecera">
              <div>
                <h2>{abierta.nombre}</h2>
                <p>
                  Solicitud recibida el {fechaHora.format(new Date(abierta.createdAt))}
                </p>
              </div>
              <button type="button" className="modal-cerrar" onClick={cerrar} aria-label="Cerrar">
                <i className="ti ti-x" />
              </button>
            </header>

            <div className="modal-cuerpo">
              <span
                className={`admin-chip ${(ESTADOS[abierta.estado] ?? ESTADOS.pendiente).clase} modal-estado`}
              >
                <i className={`ti ${(ESTADOS[abierta.estado] ?? ESTADOS.pendiente).icono}`} />
                {(ESTADOS[abierta.estado] ?? ESTADOS.pendiente).etiqueta}
              </span>

              <h3 className="modal-subtitulo">Qué pide</h3>
              <dl className="solicitud-datos">
                <div>
                  <dt>Espacio</dt>
                  <dd>{abierta.espacio}</dd>
                </div>
                <div>
                  <dt>Actividad</dt>
                  <dd>{abierta.tipoActividad}</dd>
                </div>
                <div>
                  <dt>Fecha</dt>
                  <dd>{fechaLarga(abierta.fecha)}</dd>
                </div>
                <div>
                  <dt>Horario</dt>
                  <dd>
                    {abierta.horaInicio} a {abierta.horaFin}
                  </dd>
                </div>
                <div>
                  <dt>Personas</dt>
                  <dd>{abierta.personas}</dd>
                </div>
                {abierta.requerimientos && (
                  <div>
                    <dt>Requiere</dt>
                    <dd>{abierta.requerimientos}</dd>
                  </div>
                )}
              </dl>

              <h3 className="modal-subtitulo">Qué van a hacer</h3>
              <p className="modal-descripcion">{abierta.descripcion}</p>

              <h3 className="modal-subtitulo">Quién solicita</h3>
              <dl className="solicitud-datos">
                <div>
                  <dt>Nombre</dt>
                  <dd>{abierta.nombre}</dd>
                </div>
                <div>
                  <dt>Cédula</dt>
                  <dd>{cedulaConGuiones(abierta.cedula)}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>
                    <a href={`mailto:${abierta.email}`}>{abierta.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{abierta.telefono}</dd>
                </div>
                {abierta.institucion && (
                  <div>
                    <dt>Institución</dt>
                    <dd>{abierta.institucion}</dd>
                  </div>
                )}
              </dl>

              {abierta.respuestaError && (
                <p className="modal-alerta">
                  <i className="ti ti-mail-off" />
                  <span>
                    La decisión quedó guardada, pero el correo no salió: {abierta.respuestaError}.
                    Escríbele a mano desde <strong>{abierta.email}</strong>.
                  </span>
                </p>
              )}
              {abierta.respuestaEnviada && (
                <p className="modal-ok">
                  <i className="ti ti-mail-check" /> Se le avisó por correo.
                </p>
              )}
            </div>

            <div className="modal-decision">
              <h3 className="modal-subtitulo">Responder</h3>
              <div className="admin-field admin-field-wide">
                <label htmlFor="motivo-solicitud">Mensaje para la persona</label>
                <textarea
                  id="motivo-solicitud"
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Al aprobar: cuál kiosco le tocó, cómo pagar. Al rechazar: por qué no procede."
                />
                <small className="admin-field-hint">
                  Esto entra en el correo, donde la plantilla tenga el hueco{' '}
                  <code>{'{{motivo}}'}</code>. Al rechazar es obligatorio; al aprobar puede quedar
                  vacío y la línea desaparece sola.
                </small>
              </div>

              <label className="modal-avisar">
                <input
                  type="checkbox"
                  checked={avisar}
                  onChange={(e) => setAvisar(e.target.checked)}
                />
                <span>
                  Avisarle por correo con la plantilla guardada.
                  <small>Desmárcalo si ya hablaste con la persona y el correo sobra.</small>
                </span>
              </label>

              {error && (
                <p className="form-feedback error">
                  <i className="ti ti-alert-circle" /> {error}
                </p>
              )}

              <div className="modal-acciones">
                {abierta.estado !== 'aprobada' && (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={decidiendo}
                    onClick={() => decidir(abierta, 'aprobada')}
                  >
                    <i className="ti ti-check" /> {decidiendo ? 'Guardando…' : 'Aprobar'}
                  </button>
                )}
                {abierta.estado !== 'rechazada' && (
                  <button
                    type="button"
                    className="btn-outline es-rechazar"
                    disabled={decidiendo}
                    onClick={() => decidir(abierta, 'rechazada')}
                  >
                    <i className="ti ti-x" /> Rechazar
                  </button>
                )}
                {abierta.estado === 'aprobada' && (
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={decidiendo}
                    onClick={() => decidir(abierta, 'cancelada')}
                  >
                    <i className="ti ti-ban" /> Cancelar reserva
                  </button>
                )}
                <a className="btn-outline" href={`mailto:${abierta.email}`}>
                  <i className="ti ti-corner-up-left" /> Escribirle aparte
                </a>
                <button
                  type="button"
                  className="inbox-delete"
                  onClick={() => borrar(abierta.id)}
                >
                  <i className="ti ti-trash" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
