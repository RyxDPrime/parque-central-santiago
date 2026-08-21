import { useEffect, useRef, useState } from 'react'
import {
  guardarPlantilla,
  listHuecos,
  listPlantillas,
  type HuecoPlantilla,
  type PlantillaCorreo,
} from './adminClient'

/**
 * Los correos que el sistema manda al decidir una solicitud de reserva.
 *
 * Son dos y no se crean ni se borran: una para aprobar y otra para rechazar. Si
 * faltara alguna, esa decisión se quedaría sin correo, así que aquí solo se
 * edita el texto.
 *
 * Los huecos ({{espacio}}, {{fecha}}…) los dice el servidor, no una lista
 * copiada aquí: así la ayuda nunca ofrece un hueco que ya no existe.
 */
export function PlantillasPanel() {
  const [plantillas, setPlantillas] = useState<PlantillaCorreo[]>([])
  const [huecos, setHuecos] = useState<HuecoPlantilla[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guardadaId, setGuardadaId] = useState<number | null>(null)
  const [guardandoId, setGuardandoId] = useState<number | null>(null)
  // El campo donde se escribió por última vez, para saber dónde insertar un
  // hueco cuando se pulsa en la lista de ayuda.
  const ultimoCampo = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  // Si todavía no se ha puesto el cursor en ningún campo no hay dónde insertar,
  // y el botón no haría nada. Se dice, en vez de que el clic muera en silencio.
  const [faltaCursor, setFaltaCursor] = useState(false)

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
  function insertarHueco(clave: string) {
    const campo = ultimoCampo.current
    if (!campo) {
      setFaltaCursor(true)
      return
    }
    setFaltaCursor(false)
    const id = Number(campo.dataset.plantilla)
    const cual = campo.dataset.campo as 'asunto' | 'cuerpo'
    const texto = campo.value
    const desde = campo.selectionStart ?? texto.length
    const hasta = campo.selectionEnd ?? desde
    const nuevo = `${texto.slice(0, desde)}{{${clave}}}${texto.slice(hasta)}`
    editar(id, cual, nuevo)
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
            Los correos que salen solos al aprobar o rechazar una solicitud de reserva. Lo que
            escribas aquí es lo que recibe la persona, con sus datos ya puestos.
          </p>
        </div>
      </header>

      {error && (
        <p className="admin-warning">
          <i className="ti ti-alert-triangle" /> {error}
        </p>
      )}

      {cargando && <p className="admin-panel-msg">Cargando…</p>}

      {!cargando && huecos.length > 0 && (
        <section className="admin-panel plantilla-ayuda">
          <div className="admin-panel-head">
            <h2>Los huecos que puedes usar</h2>
          </div>
          <p className="plantilla-ayuda-intro">
            Escribe uno de estos y el sistema lo cambia por el dato real de cada solicitud. Pulsa
            uno para insertarlo donde tengas el cursor. Si un hueco queda vacío —por ejemplo, no
            escribiste motivo— se borra solo, no aparece en el correo.
          </p>
          {faltaCursor && (
            <p className="form-feedback error" style={{ marginBottom: 12 }}>
              <i className="ti ti-cursor-text" /> Primero pulsa dentro del asunto o del texto,
              donde quieras que aparezca.
            </p>
          )}

          <div className="plantilla-huecos">
            {huecos.map((h) => (
              <button
                type="button"
                key={h.clave}
                className="plantilla-hueco"
                onClick={() => insertarHueco(h.clave)}
                title={h.descripcion}
              >
                <code>{`{{${h.clave}}}`}</code>
                <small>{h.descripcion}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      {!cargando &&
        plantillas.map((p) => (
          <section className="admin-panel" key={p.id}>
            <div className="admin-panel-head">
              <h2>{p.nombre}</h2>
              <span className={`admin-chip ${p.clave === 'reserva.aprobada' ? 'is-ok' : 'is-no'}`}>
                <i className={`ti ti-${p.clave === 'reserva.aprobada' ? 'check' : 'x'}`} />
                {p.clave === 'reserva.aprobada' ? 'Al aprobar' : 'Al rechazar'}
              </span>
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
                  setFaltaCursor(false)
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
                  setFaltaCursor(false)
                }}
                onChange={(e) => editar(p.id, 'cuerpo', e.target.value)}
              />
              <small className="admin-field-hint">
                Se manda tal cual, en texto plano. Los saltos de línea se respetan.
              </small>
            </div>

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
        ))}
    </div>
  )
}
