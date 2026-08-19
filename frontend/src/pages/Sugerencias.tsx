import { type FormEvent, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { api, type TipoSugerencia } from '../api/client'

/** Las cuatro razones por las que alguien escribe. Sin campo libre. */
const TIPOS: { valor: TipoSugerencia; etiqueta: string; icono: string; ayuda: string }[] = [
  { valor: 'sugerencia', etiqueta: 'Sugerencia', icono: 'ti-bulb', ayuda: 'Una idea para mejorar el parque' },
  { valor: 'felicitacion', etiqueta: 'Felicitación', icono: 'ti-mood-happy', ayuda: 'Algo que te gustó y quieres reconocer' },
  { valor: 'queja', etiqueta: 'Queja', icono: 'ti-alert-triangle', ayuda: 'Algo que salió mal o hay que atender' },
  { valor: 'otro', etiqueta: 'Otro', icono: 'ti-message-2', ayuda: 'Cualquier otra comunicación' },
]

type Estado = { tipo: 'listo' } | { tipo: 'enviando' } | { tipo: 'enviado' } | { tipo: 'error'; texto: string }

export function Sugerencias() {
  const [tipo, setTipo] = useState<TipoSugerencia>('sugerencia')
  const [estado, setEstado] = useState<Estado>({ tipo: 'listo' })

  const elegido = TIPOS.find((t) => t.valor === tipo)!

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formulario = event.currentTarget
    const datos = new FormData(formulario)
    setEstado({ tipo: 'enviando' })

    try {
      await api.enviarSugerencia({
        tipo,
        nombre: String(datos.get('nombre') ?? ''),
        email: String(datos.get('email') ?? ''),
        telefono: String(datos.get('telefono') ?? '') || undefined,
        mensaje: String(datos.get('mensaje') ?? ''),
      })
      formulario.reset()
      setEstado({ tipo: 'enviado' })
    } catch (error) {
      setEstado({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'No se pudo enviar. Intenta de nuevo.',
      })
    }
  }

  return (
    <>
      <PageHero
        pagina="sugerencias"
        label="Tu voz cuenta"
        title="Sugerencias y comunicaciones"
        description="El Parque es de todos, y se mejora con lo que nos cuentan quienes lo visitan. Escríbenos: leemos cada mensaje."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="sugerencia-inner">
          {estado.tipo === 'enviado' ? (
            <div className="sugerencia-gracias">
              <div className="sugerencia-gracias-icono">
                <i className="ti ti-circle-check" />
              </div>
              <h2>¡Gracias por escribirnos!</h2>
              <p>
                Recibimos tu mensaje y el equipo del Parque lo va a revisar. Si hace falta
                responderte, lo haremos al correo que nos dejaste.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setEstado({ tipo: 'listo' })}
              >
                <i className="ti ti-plus" /> Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className="sugerencia-card" onSubmit={enviar}>
              <fieldset className="sugerencia-tipos">
                <legend>¿Sobre qué nos escribes?</legend>
                <div className="sugerencia-tipos-fila">
                  {TIPOS.map((t) => (
                    <button
                      type="button"
                      key={t.valor}
                      className={`sugerencia-tipo${tipo === t.valor ? ' esta-elegido' : ''}`}
                      onClick={() => setTipo(t.valor)}
                      aria-pressed={tipo === t.valor}
                    >
                      <i className={`ti ${t.icono}`} />
                      <span>{t.etiqueta}</span>
                    </button>
                  ))}
                </div>
                <p className="sugerencia-tipo-ayuda">{elegido.ayuda}</p>
              </fieldset>

              <div className="sugerencia-campos">
                <div className="form-group">
                  <label htmlFor="s-nombre">Tu nombre</label>
                  <input id="s-nombre" name="nombre" type="text" required minLength={2} placeholder="Cómo te llamas" />
                </div>

                <div className="form-group">
                  <label htmlFor="s-email">Tu correo</label>
                  <input id="s-email" name="email" type="email" required placeholder="Para responderte" />
                </div>

                <div className="form-group">
                  <label htmlFor="s-telefono">Teléfono <span className="opcional">opcional</span></label>
                  <input id="s-telefono" name="telefono" type="tel" placeholder="(809) 000-0000" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="s-mensaje">Cuéntanos</label>
                <textarea
                  id="s-mensaje"
                  name="mensaje"
                  rows={6}
                  required
                  minLength={10}
                  placeholder="Escribe con confianza: mientras más detalles nos des, mejor podemos atenderlo."
                />
              </div>

              {estado.tipo === 'error' && (
                <p className="form-feedback error">
                  <i className="ti ti-alert-circle" /> {estado.texto}
                </p>
              )}

              <button type="submit" className="btn-primary sugerencia-enviar" disabled={estado.tipo === 'enviando'}>
                <i className="ti ti-send" />
                {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
              </button>

              <p className="sugerencia-nota">
                Tus datos solo se usan para responderte. No se comparten con nadie.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
