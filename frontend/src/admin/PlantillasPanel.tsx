import { useEffect, useRef, useState } from 'react'
import {
  guardarPlantilla,
  listHuecos,
  listPlantillas,
  type HuecoPlantilla,
  type PlantillaCorreo,
} from './adminClient'

/**
 * Los correos que el sistema manda solo: las dos decisiones de una reserva y la
 * respuesta a quien quiere aportar.
 *
 * El conjunto es fijo —se editan, no se crean ni se borran—: si faltara alguna,
 * esa decisión se quedaría sin correo.
 *
 * Cada plantilla muestra únicamente los huecos de SU familia. Ofrecer
 * {{espacio}} dentro de un correo de donación sería ofrecer un hueco que se va
 * a rellenar con nada.
 */

/** "reserva.aprobada" -> "reserva". */
function familiaDe(clave: string): string {
  return clave.split('.')[0]
}

const SELLO: Record<string, { texto: string; clase: string; icono: string }> = {
  'reserva.aprobada': { texto: 'Al aprobar una reserva', clase: 'is-ok', icono: 'ti-check' },
  'reserva.rechazada': { texto: 'Al rechazar una reserva', clase: 'is-no', icono: 'ti-x' },
  'aporte.respuesta': { texto: 'Al atender un aporte', clase: 'is-ok', icono: 'ti-heart-handshake' },
}

const NOMBRE_FAMILIA: Record<string, string> = {
  reserva: 'Reservas',
  aporte: 'Donaciones',
}

export function PlantillasPanel() {
  const [plantillas, setPlantillas] = useState<PlantillaCorreo[]>([])
  const [huecos, setHuecos] = useState<Record<string, HuecoPlantilla[]>>({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guardadaId, setGuardadaId] = useState<number | null>(null)
  const [guardandoId, setGuardandoId] = useState<number | null>(null)
  // El campo donde se escribió por última vez, para saber dónde insertar un
  // hueco cuando se pulsa en la lista de ayuda.
  const ultimoCampo = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  // Si todavía no se ha puesto el cursor en ningún campo no hay dónde insertar,
  // y el botón no haría nada. Se dice, en vez de que el clic muera en silencio.
  const [faltaCursor, setFaltaCursor] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([listPlantillas(), listHuecos()])
      .then(([p, h]) => {
        setPlantillas(p)
        setHuecos(h)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [])

  function editar(id: number, campo: 'asunto' | 'cuerpo', valor: string) {
    setPlantillas((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)))
  }

  /** Mete el hueco donde está el cursor, en vez de obligar a escribirlo a mano. */
  function insertarHueco(plantillaId: number, clave: string) {
    const campo = ultimoCampo.current
    // Solo vale si el cursor está en un campo de ESTA plantilla: insertar el
    // hueco de una donación dentro del correo de una reserva no tendría sentido.
    if (!campo || Number(campo.dataset.plantilla) !== plantillaId) {
      setFaltaCursor(plantillaId)
      return
    }
    setFaltaCursor(null)
    const cual = campo.dataset.campo as 'asunto' | 'cuerpo'
    const texto = campo.value
    const desde = campo.selectionStart ?? texto.length
    const hasta = campo.selectionEnd ?? desde
    editar(plantillaId, cual, `${texto.slice(0, desde)}{{${clave}}}${texto.slice(hasta)}`)
    requestAnimationFrame(() => {
      campo.focus()
      const pos = desde + clave.length + 4
      campo.setSelectionRange(pos, pos)
    })
  }

  async function guardar(p: PlantillaCorreo) {
    setGuardandoId(p.id)
    setError(null)
    try {
      const actualizada = await guardarPlantilla(p.id, { asunto: p.asunto, cuerpo: p.cuerpo })
      setPlantillas((prev) => prev.map((x) => (x.id === p.id ? actualizada : x)))
      setGuardadaId(p.id)
      setTimeout(() => setGuardadaId(null), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setGuardandoId(null)
    }
  }

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-mail-cog" />
        </div>
        <div>
          <h1>Plantillas de respuesta</h1>
          <p>
            Los correos que salen solos al decidir una reserva o atender un aporte. Lo que escribas
            aquí es lo que recibe la persona, con sus datos ya puestos.
          </p>
        </div>
      </header>

      {error && (
        <p className="admin-warning">
          <i className="ti ti-alert-triangle" /> {error}
        </p>
      )}

      {cargando && <p className="admin-panel-msg">Cargando…</p>}

      {!cargando &&
        plantillas.map((p) => {
          const familia = familiaDe(p.clave)
          const sello = SELLO[p.clave]
          const misHuecos = huecos[familia] ?? []

          return (
            <section className="admin-panel" key={p.id}>
              <div className="admin-panel-head">
                <h2>{p.nombre}</h2>
                {sello && (
                  <span className={`admin-chip ${sello.clase}`}>
                    <i className={`ti ${sello.icono}`} /> {sello.texto}
                  </span>
                )}
              </div>

              <p className="plantilla-descripcion">{p.descripcion}</p>

              <div className="admin-field admin-field-wide">
                <label htmlFor={`asunto-${p.id}`}>Asunto del correo</label>
                <input
                  id={`asunto-${p.id}`}
                  type="text"
                  value={p.asunto}
                  data-plantilla={p.id}
                  data-campo="asunto"
                  onFocus={(e) => {
                    ultimoCampo.current = e.currentTarget
                    setFaltaCursor(null)
                  }}
                  onChange={(e) => editar(p.id, 'asunto', e.target.value)}
                />
                <small className="admin-field-hint">
                  Lo que se ve en la bandeja de entrada antes de abrir el correo.
                </small>
              </div>

              <div className="admin-field admin-field-wide">
                <label htmlFor={`cuerpo-${p.id}`}>Texto del correo</label>
                <textarea
                  id={`cuerpo-${p.id}`}
                  rows={16}
                  value={p.cuerpo}
                  data-plantilla={p.id}
                  data-campo="cuerpo"
                  className="plantilla-cuerpo"
                  onFocus={(e) => {
                    ultimoCampo.current = e.currentTarget
                    setFaltaCursor(null)
                  }}
                  onChange={(e) => editar(p.id, 'cuerpo', e.target.value)}
                />
                <small className="admin-field-hint">
                  Se manda tal cual, en texto plano. Los saltos de línea se respetan.
                </small>
              </div>

              {misHuecos.length > 0 && (
                <div className="plantilla-ayuda">
                  <h3>
                    Huecos disponibles
                    <span className="plantilla-familia">{NOMBRE_FAMILIA[familia] ?? familia}</span>
                  </h3>
                  <p className="plantilla-ayuda-intro">
                    Pulsa uno para insertarlo donde tengas el cursor. El sistema lo cambia por el
                    dato real de cada caso; si queda vacío, se borra solo y no aparece en el correo.
                  </p>

                  {faltaCursor === p.id && (
                    <p className="form-feedback error" style={{ marginBottom: 12 }}>
                      <i className="ti ti-cursor-text" /> Primero pulsa dentro del asunto o del
                      texto de arriba, donde quieras que aparezca.
                    </p>
                  )}

                  <div className="plantilla-huecos">
                    {misHuecos.map((h) => (
                      <button
                        type="button"
                        key={h.clave}
                        className="plantilla-hueco"
                        onClick={() => insertarHueco(p.id, h.clave)}
                        title={h.descripcion}
                      >
                        <code>{`{{${h.clave}}}`}</code>
                        <small>{h.descripcion}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => guardar(p)}
                  disabled={guardandoId === p.id}
                >
                  <i className="ti ti-device-floppy" />
                  {guardandoId === p.id ? ' Guardando…' : ' Guardar plantilla'}
                </button>
                {guardadaId === p.id && (
                  <span className="texto-guardado">
                    <i className="ti ti-check" /> Guardada
                  </span>
                )}
              </div>
            </section>
          )
        })}
    </div>
  )
}
