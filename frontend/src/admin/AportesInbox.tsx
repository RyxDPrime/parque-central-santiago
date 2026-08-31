import { useEffect, useMemo, useState } from 'react'
import {
  decidirAporte,
  eliminarAporte,
  listAportes,
  listMotivosRechazo,
  type Aporte,
  type MotivoRechazo,
} from './adminClient'

const fechaHora = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const TIPOS: Record<string, { etiqueta: string; icono: string }> = {
  dinero: { etiqueta: 'Donación', icono: 'ti-heart-handshake' },
  patrocinio: { etiqueta: 'Patrocinio', icono: 'ti-building-community' },
  voluntariado: { etiqueta: 'Voluntariado', icono: 'ti-friends' },
}

const ESTADOS: Record<string, { etiqueta: string; clase: string; icono: string }> = {
  pendiente: { etiqueta: 'Sin revisar', clase: 'is-warn', icono: 'ti-clock' },
  aceptada: { etiqueta: 'Aceptado', clase: 'is-ok', icono: 'ti-check' },
  rechazada: { etiqueta: 'No aceptado', clase: 'is-no', icono: 'ti-x' },
}

const fechaDecision = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit',
})

function pesos(monto: number): string {
  return `RD$ ${monto.toLocaleString('es-DO')}`
}

/** Una línea, para barrer la lista sin abrir nada. */
function resumen(a: Aporte): string {
  const tipo = TIPOS[a.tipo]?.etiqueta ?? a.tipo
  return [
    tipo,
    a.monto ? pesos(a.monto) : null,
    a.frecuencia === 'mensual' ? 'cada mes' : a.frecuencia === 'unica' ? 'una vez' : null,
    a.institucion,
  ]
    .filter(Boolean)
    .join(' · ')
}

/**
 * Bandeja de quienes quieren aportar al Parque.
 *
 * Nadie ha pagado nada todavía: son intenciones, y lo que sigue es que alguien
 * del Parque revise y decida.
 *
 * Aceptar o no aceptar un aporte es una decisión que hay que poder sostener: el
 * Parque está obligado a conocer el origen de lo que recibe. Por eso el rechazo
 * exige elegir un motivo de una lista, y queda registrado quién decidió y
 * cuándo. "Alguien lo rechazó" no es una explicación.
 *
 * El motivo es INTERNO y no viaja en ningún correo. Lo que recibe la persona es
 * el texto que el equipo redacta aparte.
 */
export function AportesInbox() {
  const [items, setItems] = useState<Aporte[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('pendiente')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [recienTocados, setRecienTocados] = useState<number[]>([])

  const [abiertoId, setAbiertoId] = useState<number | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [motivo, setMotivo] = useState('')
  const [avisar, setAvisar] = useState(true)
  const [motivos, setMotivos] = useState<MotivoRechazo[]>([])
  const [guardando, setGuardando] = useState(false)

  const abierto = items.find((x) => x.id === abiertoId) ?? null

  useEffect(() => {
    listMotivosRechazo().then(setMotivos).catch(() => setMotivos([]))
    listAportes()
      .then((d) => {
        setItems(d)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    document.body.style.overflow = abiertoId ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abiertoId])

  useEffect(() => {
    if (!abiertoId) return
    function alPulsar(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abiertoId])

  function abrir(a: Aporte) {
    setAbiertoId(a.id)
    setRespuesta('')
    setMotivo(a.motivoRechazo ?? '')
    setAvisar(true)
    setError(null)
  }

  function cerrar() {
    setAbiertoId(null)
    setRespuesta('')
    setMotivo('')
  }

  async function decidir(a: Aporte, estado: string) {
    // Rechazar exige motivo. Una negativa sin razon registrada no se puede
    // explicar despues ni contrastar con la decision de un caso parecido.
    if (estado === 'rechazada' && !motivo) {
      setError('Elige el motivo del rechazo: queda como constancia de la decisión.')
      return
    }
    if (avisar && !respuesta.trim()) {
      setError('Escribe el mensaje para la persona: es lo que va a leer en el correo.')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      const actualizado = await decidirAporte(a.id, {
        estado,
        motivoRechazo: estado === 'rechazada' ? motivo : undefined,
        respuesta: respuesta.trim(),
        avisar,
      })
      setItems((prev) => prev.map((x) => (x.id === a.id ? actualizado : x)))
      setRecienTocados((prev) => (prev.includes(a.id) ? prev : [...prev, a.id]))
      if (!actualizado.respuestaError) cerrar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(id: number) {
    if (!window.confirm('¿Eliminar este mensaje? No se puede deshacer.')) return
    try {
      await eliminarAporte(id)
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
        [x.nombre, x.email, x.institucion, x.mensaje].some((v) =>
          (v ?? '').toLowerCase().includes(q),
        ),
      )
    }
    if (filtroTipo) r = r.filter((x) => x.tipo === filtroTipo)
    if (filtroEstado) {
      r = r.filter((x) => x.estado === filtroEstado || recienTocados.includes(x.id))
    }
    return r
  }, [items, busqueda, filtroTipo, filtroEstado, recienTocados])

  const hayFiltros = Boolean(busqueda.trim()) || Boolean(filtroEstado) || Boolean(filtroTipo)

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-heart-handshake" />
        </div>
        <div>
          <h1>Aportes y donaciones</h1>
          <p>
            Quienes quieren apoyar al Parque desde la página de Donaciones. Nadie ha pagado nada:
            hay que contactarlos para coordinarlo.
          </p>
        </div>
      </header>

      {pendientes > 0 && (
        <p className="admin-warning">
          <i className="ti ti-clock" />
          {pendientes === 1
            ? 'Hay 1 aporte sin revisar.'
            : `Hay ${pendientes} aportes sin revisar.`}
        </p>
      )}

      {sinAvisar > 0 && (
        <p className="admin-warning">
          <i className="ti ti-mail-off" />
          {sinAvisar === 1
            ? 'Hay 1 aporte decidido cuyo correo no salió. Ábrelo y escríbele a mano.'
            : `Hay ${sinAvisar} aportes decididos cuyo correo no salió. Ábrelos y escríbeles a mano.`}
        </p>
      )}

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Mensajes</h2>
          <span className="admin-count">
            {hayFiltros ? `${visibles.length} de ${items.length}` : items.length}
          </span>
        </div>

        {!cargando && items.length > 0 && (
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="ti ti-search" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, correo o institución…"
                aria-label="Buscar aportes"
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
              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value)
                  setRecienTocados([])
                }}
              >
                <option value="">Todos</option>
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
                  setFiltroTipo('')
                  setRecienTocados([])
                }}
              >
                <i className="ti ti-x" /> Limpiar
              </button>
            )}
          </div>
        )}

        {cargando && <p className="admin-panel-msg">Cargando…</p>}
        {error && !abierto && <p className="admin-panel-msg is-error">{error}</p>}

        {!cargando && items.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-heart-off" />
            <h3>Todavía no hay mensajes</h3>
            <p>Aquí aparecerá quien escriba desde la página de Donaciones del sitio.</p>
          </div>
        )}

        {!cargando && items.length > 0 && visibles.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-search-off" />
            <h3>Ninguno coincide</h3>
            <p>Prueba con otra búsqueda o quita los filtros.</p>
          </div>
        )}

        {!cargando && visibles.length > 0 && (
          <ul className="solicitud-lista">
            {visibles.map((a) => {
              const estado = ESTADOS[a.estado] ?? ESTADOS.pendiente
              const tipo = TIPOS[a.tipo] ?? { etiqueta: a.tipo, icono: 'ti-heart' }
              return (
                <li
                  className={`solicitud-fila${a.estado === 'pendiente' ? ' esta-pendiente' : ''}${
                    recienTocados.includes(a.id) ? ' recien-decidida' : ''
                  }`}
                  key={a.id}
                >
                  <div className="solicitud-fila-texto">
                    <h3>
                      <i className={`ti ${tipo.icono} aporte-icono`} /> {a.nombre}
                    </h3>
                    <p>{resumen(a)}</p>
                  </div>

                  <div className="solicitud-fila-lado">
                    <span className={`admin-chip ${estado.clase}`}>
                      <i className={`ti ${estado.icono}`} /> {estado.etiqueta}
                    </span>
                    {a.respuestaError && (
                      <span className="admin-chip is-no" title={a.respuestaError}>
                        <i className="ti ti-mail-off" /> Sin avisar
                      </span>
                    )}
                    <button type="button" className="btn-outline" onClick={() => abrir(a)}>
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
      {abierto && (
        <div
          className="modal-fondo"
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrar()
          }}
        >
          <div className="modal-caja" role="dialog" aria-modal="true" aria-label="Detalle del aporte">
            <header className="modal-cabecera">
              <div>
                <h2>{abierto.nombre}</h2>
                <p>Escribió el {fechaHora.format(new Date(abierto.createdAt))}</p>
              </div>
              <button type="button" className="modal-cerrar" onClick={cerrar} aria-label="Cerrar">
                <i className="ti ti-x" />
              </button>
            </header>

            <div className="modal-cuerpo">
              <span
                className={`admin-chip ${(ESTADOS[abierto.estado] ?? ESTADOS.pendiente).clase} modal-estado`}
              >
                <i className={`ti ${(ESTADOS[abierto.estado] ?? ESTADOS.pendiente).icono}`} />
                {(ESTADOS[abierto.estado] ?? ESTADOS.pendiente).etiqueta}
              </span>

              <h3 className="modal-subtitulo">Qué ofrece</h3>
              <dl className="solicitud-datos">
                <div>
                  <dt>Tipo</dt>
                  <dd>{TIPOS[abierto.tipo]?.etiqueta ?? abierto.tipo}</dd>
                </div>
                {abierto.monto != null && (
                  <div>
                    <dt>Monto que plantea</dt>
                    <dd>{pesos(abierto.monto)}</dd>
                  </div>
                )}
                {abierto.frecuencia && (
                  <div>
                    <dt>Frecuencia</dt>
                    <dd>{abierto.frecuencia === 'mensual' ? 'Cada mes' : 'Una sola vez'}</dd>
                  </div>
                )}
                {abierto.institucion && (
                  <div>
                    <dt>Institución</dt>
                    <dd>{abierto.institucion}</dd>
                  </div>
                )}
              </dl>

              <h3 className="modal-subtitulo">Lo que escribió</h3>
              <p className="modal-descripcion">{abierto.mensaje}</p>

              {(abierto.origenFondos || abierto.documento) && (
                <>
                  <h3 className="modal-subtitulo">De dónde salen los fondos</h3>
                  <dl className="solicitud-datos">
                    {abierto.donanteTipo && (
                      <div>
                        <dt>Declara ser</dt>
                        <dd>
                          {abierto.donanteTipo === 'empresa' ? 'Empresa o institución' : 'Persona'}
                        </dd>
                      </div>
                    )}
                    {abierto.documento && (
                      <div>
                        <dt>{abierto.donanteTipo === 'empresa' ? 'RNC' : 'Cédula'}</dt>
                        <dd>{abierto.documento}</dd>
                      </div>
                    )}
                    {abierto.origenFondos && (
                      <div>
                        <dt>Origen</dt>
                        <dd>{abierto.origenFondos}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Declaró origen lícito</dt>
                      <dd>{abierto.declaraLicito ? 'Sí' : 'No'}</dd>
                    </div>
                  </dl>
                  {/* No descalifica a nadie: pide mirar con más detenimiento. */}
                  {abierto.esPep && (
                    <p className="modal-alerta">
                      <i className="ti ti-alert-triangle" />
                      <span>
                        Declaró ocupar o haber ocupado un{' '}
                        <strong>cargo público de alto nivel</strong>, o ser familiar cercano de
                        alguien que lo ocupa. No impide aceptar el aporte, pero pide revisarlo con
                        más detenimiento.
                      </span>
                    </p>
                  )}
                </>
              )}

              <h3 className="modal-subtitulo">Cómo contactarle</h3>
              <dl className="solicitud-datos">
                <div>
                  <dt>Correo</dt>
                  <dd>
                    <a href={`mailto:${abierto.email}`}>{abierto.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Teléfono</dt>
                  <dd>{abierto.telefono}</dd>
                </div>
              </dl>

              {abierto.decididaEn && (
                <p className="modal-constancia">
                  <i className="ti ti-writing-sign" />
                  <span>
                    {abierto.estado === 'aceptada' ? 'Aceptado' : 'No aceptado'} por{' '}
                    <strong>{abierto.decididaPor ?? 'alguien del equipo'}</strong> el{' '}
                    {fechaDecision.format(new Date(abierto.decididaEn))}.
                    {abierto.motivoRechazo && (
                      <>
                        {' '}
                        Motivo registrado: <strong>{abierto.motivoRechazo}</strong>.
                      </>
                    )}
                  </span>
                </p>
              )}

              {abierto.respuestaError && (
                <p className="modal-alerta">
                  <i className="ti ti-mail-off" />
                  <span>
                    Quedó marcado como atendido, pero el correo no salió: {abierto.respuestaError}.
                    Escríbele a mano a <strong>{abierto.email}</strong>.
                  </span>
                </p>
              )}
              {abierto.respuestaEnviada && (
                <p className="modal-ok">
                  <i className="ti ti-mail-check" /> Se le respondió por correo.
                </p>
              )}
            </div>

            <div className="modal-decision">
              <h3 className="modal-subtitulo">Responder</h3>
              <div className="admin-field admin-field-wide">
                <label htmlFor="respuesta-aporte">Mensaje para la persona</label>
                <textarea
                  id="respuesta-aporte"
                  rows={4}
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  placeholder="Cómo seguir: a quién contactar, cuándo pasar, qué hace falta de su parte…"
                />
                <small className="admin-field-hint">
                  Entra en el correo donde la plantilla tenga el hueco <code>{'{{respuesta}}'}</code>
                  . El texto que lo rodea se edita en Plantillas de respuesta.
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

              {/* El motivo solo hace falta para negarse, pero se muestra
                  siempre: verlo antes de decidir ayuda a pensar la decisión. */}
              <div className="admin-field admin-field-wide">
                <label htmlFor="motivo-rechazo">Si no se acepta, ¿por qué?</label>
                <select
                  id="motivo-rechazo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                >
                  <option value="">Elige el motivo</option>
                  {motivos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <small className="admin-field-hint">
                  Queda como constancia interna de la decisión.{' '}
                  <strong>No se le manda a la persona</strong>: lo que ella lee es el mensaje de
                  arriba.
                </small>
              </div>

              <div className="modal-acciones">
                {abierto.estado !== 'aceptada' && (
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={guardando}
                    onClick={() => decidir(abierto, 'aceptada')}
                  >
                    <i className="ti ti-check" /> {guardando ? 'Guardando…' : 'Aceptar el aporte'}
                  </button>
                )}
                {abierto.estado !== 'rechazada' && (
                  <button
                    type="button"
                    className="btn-outline es-rechazar"
                    disabled={guardando}
                    onClick={() => decidir(abierto, 'rechazada')}
                  >
                    <i className="ti ti-x" /> No aceptar
                  </button>
                )}
                <a className="btn-outline" href={`mailto:${abierto.email}`}>
                  <i className="ti ti-corner-up-left" /> Escribirle aparte
                </a>
                <button type="button" className="inbox-delete" onClick={() => borrar(abierto.id)}>
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
