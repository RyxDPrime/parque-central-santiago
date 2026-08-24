import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useTextos } from '../hooks/useTextos'
import { api, type TipoAporte } from '../api/client'

/**
 * Página de donaciones.
 *
 * El sitio no cobra nada todavía —la afiliación con la pasarela de pago está
 * pendiente—, así que lo que se envía es una intención de aportar: la persona
 * dice qué quiere dar y el Parque la contacta. Eso se dice con todas sus letras
 * en la página y en el correo de acuse, porque alguien podría creer que ya donó.
 *
 * Los datos bancarios salen del panel y el bloque NO se muestra mientras estén
 * en blanco. Es deliberado: una cuenta equivocada en una página de donaciones
 * manda el dinero de un ciudadano a otra parte.
 */

const TIPOS: { valor: TipoAporte; etiqueta: string; icono: string; ayuda: string }[] = [
  {
    valor: 'dinero',
    etiqueta: 'Donar dinero',
    icono: 'ti-heart-handshake',
    ayuda: 'Un aporte puntual o mensual para el mantenimiento del parque.',
  },
  {
    valor: 'patrocinio',
    etiqueta: 'Patrocinar',
    icono: 'ti-building-community',
    ayuda: 'Tu empresa o institución apadrina un espacio, un programa o una actividad.',
  },
  {
    valor: 'voluntariado',
    etiqueta: 'Ser voluntario',
    icono: 'ti-friends',
    ayuda: 'Aportar tu tiempo. También cuentan las horas de servicio estudiantil.',
  },
]

/** Cifras redondas para no obligar a pensar un número desde cero. */
const MONTOS = [500, 1000, 2500, 5000]

type Estado =
  | { tipo: 'listo' }
  | { tipo: 'enviando' }
  | { tipo: 'enviado' }
  | { tipo: 'error'; texto: string }

export function Donaciones() {
  const texto = useTextos()
  const [tipo, setTipo] = useState<TipoAporte>('dinero')
  const [monto, setMonto] = useState('')
  const [frecuencia, setFrecuencia] = useState<'unica' | 'mensual'>('unica')
  const [estado, setEstado] = useState<Estado>({ tipo: 'listo' })

  const elegido = TIPOS.find((t) => t.valor === tipo)!
  const esDinero = tipo === 'dinero'

  // El bloque de transferencia solo existe si hay banco Y número de cuenta.
  // Medio dato bancario no sirve para transferir y sí para confundir.
  const banco = texto('donaciones.banco').trim()
  const cuenta = texto('donaciones.cuenta').trim()
  const hayDatosBancarios = Boolean(banco) && Boolean(cuenta)

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formulario = event.currentTarget
    const datos = new FormData(formulario)
    setEstado({ tipo: 'enviando' })

    try {
      await api.enviarAporte({
        tipo,
        nombre: String(datos.get('nombre') ?? ''),
        email: String(datos.get('email') ?? ''),
        telefono: String(datos.get('telefono') ?? ''),
        institucion: String(datos.get('institucion') ?? '') || undefined,
        monto: esDinero && monto ? Number(monto) : undefined,
        frecuencia: esDinero ? frecuencia : undefined,
        mensaje: String(datos.get('mensaje') ?? ''),
      })
      formulario.reset()
      setMonto('')
      setEstado({ tipo: 'enviado' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setEstado({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'No se pudo enviar. Intenta de nuevo.',
      })
    }
  }

  const hero = (
    <PageHero
      pagina="donaciones"
      label="Apóyanos"
      title="Donaciones"
      description="El parque se sostiene con lo que aporta la gente que lo usa y las instituciones que creen en él."
      image="/images/galeria/vista-aerea-parque.jpg"
    />
  )

  if (estado.tipo === 'enviado') {
    return (
      <>
        {hero}
        <section className="section">
          <div className="donacion-inner">
            <div className="sugerencia-gracias">
              <div className="sugerencia-gracias-icono">
                <i className="ti ti-heart" />
              </div>
              <h2>Gracias por dar el paso</h2>
              <p>
                Recibimos tu mensaje y alguien del equipo del Parque te va a escribir para
                coordinarlo. Te mandamos una copia a tu correo.
              </p>
              <p className="reserva-gracias-aviso">
                <i className="ti ti-info-circle" />
                <span>
                  No se te ha cobrado nada. Cualquier aporte se coordina directamente contigo, y
                  eres tú quien decide cómo y cuándo hacerlo.
                </span>
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setEstado({ tipo: 'listo' })}
              >
                <i className="ti ti-plus" /> Enviar otro mensaje
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {hero}

      <section className="section">
        <div className="donacion-inner">
          {/* ── Por qué ── */}
          <div className="donacion-porque">
            <p className="donacion-intro">{texto('donaciones.intro')}</p>
            {texto('donaciones.destino') && (
              <p className="donacion-destino">
                <i className="ti ti-seeding" />
                <span>{texto('donaciones.destino')}</span>
              </p>
            )}
          </div>

          {/* ── Formulario ── */}
          <form className="donacion-card" onSubmit={enviar}>
            <fieldset className="donacion-tipos">
              <legend>¿Cómo te gustaría apoyar?</legend>
              <div className="donacion-tipos-fila">
                {TIPOS.map((t) => (
                  <button
                    type="button"
                    key={t.valor}
                    className={`donacion-tipo${tipo === t.valor ? ' esta-elegido' : ''}`}
                    onClick={() => setTipo(t.valor)}
                    aria-pressed={tipo === t.valor}
                  >
                    <i className={`ti ${t.icono}`} />
                    <span>{t.etiqueta}</span>
                  </button>
                ))}
              </div>
              <p className="donacion-tipo-ayuda">{elegido.ayuda}</p>
            </fieldset>

            {/* Monto y frecuencia solo aplican al dinero. */}
            {esDinero && (
              <div className="donacion-monto">
                <span className="donacion-monto-titulo">
                  ¿Cuánto tienes en mente? <span className="opcional">opcional</span>
                </span>
                <div className="donacion-montos-fila">
                  {MONTOS.map((m) => (
                    <button
                      type="button"
                      key={m}
                      className={`donacion-monto-btn${String(m) === monto ? ' esta-elegido' : ''}`}
                      onClick={() => setMonto(String(m) === monto ? '' : String(m))}
                      aria-pressed={String(m) === monto}
                    >
                      RD$ {m.toLocaleString('es-DO')}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    className="donacion-monto-otro"
                    value={MONTOS.includes(Number(monto)) ? '' : monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Otro monto"
                    aria-label="Otro monto"
                  />
                </div>

                <div className="donacion-frecuencia">
                  {(['unica', 'mensual'] as const).map((f) => (
                    <button
                      type="button"
                      key={f}
                      className={`donacion-frec${frecuencia === f ? ' esta-elegido' : ''}`}
                      onClick={() => setFrecuencia(f)}
                      aria-pressed={frecuencia === f}
                    >
                      {f === 'unica' ? 'Una sola vez' : 'Cada mes'}
                    </button>
                  ))}
                </div>

                <p className="donacion-monto-nota">
                  Es solo para saber de qué estamos hablando. Puedes dejarlo en blanco y decidirlo
                  al conversar.
                </p>
              </div>
            )}

            <div className="donacion-campos">
              <div className="form-group">
                <label htmlFor="d-nombre">Tu nombre</label>
                <input id="d-nombre" name="nombre" type="text" required minLength={3} placeholder="Nombre y apellido" />
              </div>
              <div className="form-group">
                <label htmlFor="d-email">Tu correo</label>
                <input id="d-email" name="email" type="email" required placeholder="Para escribirte" />
              </div>
              <div className="form-group">
                <label htmlFor="d-telefono">Teléfono</label>
                <input id="d-telefono" name="telefono" type="tel" required placeholder="(809) 000-0000" />
              </div>
              <div className="form-group">
                <label htmlFor="d-institucion">
                  Empresa o institución{' '}
                  {tipo === 'patrocinio' ? null : <span className="opcional">opcional</span>}
                </label>
                <input
                  id="d-institucion"
                  name="institucion"
                  type="text"
                  required={tipo === 'patrocinio'}
                  placeholder={tipo === 'patrocinio' ? 'A quién representas' : 'Si aplica'}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="d-mensaje">
                {tipo === 'voluntariado'
                  ? '¿En qué te gustaría ayudar?'
                  : tipo === 'patrocinio'
                    ? '¿Qué te interesaría patrocinar?'
                    : 'Cuéntanos'}
              </label>
              <textarea
                id="d-mensaje"
                name="mensaje"
                rows={5}
                required
                minLength={10}
                placeholder={
                  tipo === 'voluntariado'
                    ? 'Qué sabes hacer, cuánto tiempo tienes disponible, si son horas de servicio estudiantil…'
                    : tipo === 'patrocinio'
                      ? 'Un espacio, un programa, una actividad… o cuéntanos y te proponemos opciones.'
                      : 'Lo que quieras contarnos sobre tu aporte.'
                }
              />
            </div>

            {estado.tipo === 'error' && (
              <p className="form-feedback error">
                <i className="ti ti-alert-circle" /> {estado.texto}
              </p>
            )}

            <button type="submit" className="btn-primary donacion-enviar" disabled={estado.tipo === 'enviando'}>
              <i className="ti ti-send" />
              {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
            </button>

            <p className="donacion-nota">
              <i className="ti ti-lock" /> Esto no cobra nada. Es un mensaje al Parque; el aporte se
              coordina después contigo.
            </p>
          </form>

          {/* ── Transferencia directa ── */}
          {hayDatosBancarios && (
            <div className="donacion-banco">
              <h2>
                <i className="ti ti-building-bank" /> Transferencia directa
              </h2>
              <p className="donacion-banco-intro">
                Si prefieres transferir sin esperar a que te contactemos, estos son los datos de la
                cuenta del Patronato.
              </p>
              <dl className="donacion-banco-datos">
                <div>
                  <dt>Banco</dt>
                  <dd>{banco}</dd>
                </div>
                {texto('donaciones.tipoCuenta') && (
                  <div>
                    <dt>Tipo de cuenta</dt>
                    <dd>{texto('donaciones.tipoCuenta')}</dd>
                  </div>
                )}
                <div>
                  <dt>Número de cuenta</dt>
                  <dd className="es-cuenta">{cuenta}</dd>
                </div>
                {texto('donaciones.titular') && (
                  <div>
                    <dt>A nombre de</dt>
                    <dd>{texto('donaciones.titular')}</dd>
                  </div>
                )}
                {texto('donaciones.rnc') && (
                  <div>
                    <dt>RNC</dt>
                    <dd>{texto('donaciones.rnc')}</dd>
                  </div>
                )}
              </dl>
              {texto('donaciones.notaTransferencia') && (
                <p className="donacion-banco-nota">{texto('donaciones.notaTransferencia')}</p>
              )}
            </div>
          )}

          {/* ── Transparencia ── */}
          <div className="donacion-transparencia">
            <i className="ti ti-file-check" />
            <div>
              <h3>Puedes ver en qué se usa</h3>
              <p>
                El Parque es administrado por un patronato sin fines de lucro, registrado bajo la
                Ley 122-05. Los estados financieros y los documentos institucionales están
                publicados.
              </p>
              <Link to="/transparencia" className="btn-outline">
                Ver Transparencia <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
