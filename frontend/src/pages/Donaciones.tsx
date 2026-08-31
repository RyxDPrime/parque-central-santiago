import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useApiData } from '../hooks/useApiData'
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
 * Las cuentas bancarias son una tabla que el Parque administra: pueden ser
 * varias —una por banco, o una en pesos y otra en dólares— y el bloque no
 * aparece mientras no haya ninguna. Es deliberado: una cuenta equivocada en una
 * página de donaciones manda el dinero de un ciudadano a otra parte, así que
 * antes de mostrar algo dudoso, no se muestra nada.
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
  const { data: cuentas } = useApiData(api.getCuentasBancarias)
  const { data: origenes } = useApiData(api.getOrigenesFondos)
  const [tipo, setTipo] = useState<TipoAporte>('dinero')
  const [monto, setMonto] = useState('')
  const [frecuencia, setFrecuencia] = useState<'unica' | 'mensual'>('unica')
  const [donanteTipo, setDonanteTipo] = useState<'persona' | 'empresa'>('persona')
  const [estado, setEstado] = useState<Estado>({ tipo: 'listo' })

  const elegido = TIPOS.find((t) => t.valor === tipo)!
  const esDinero = tipo === 'dinero'

  const hayCuentas = cuentas !== null && cuentas.length > 0

  /**
   * A partir de qué monto hay que declarar de dónde salen los fondos. Lo fija
   * el Parque desde el panel; en cero se le pide a todo el mundo.
   *
   * Un patrocinio institucional declara siempre: por definición viene de una
   * empresa y suele ser la cifra grande. El servidor comprueba lo mismo, así
   * que esconder los campos aquí solo evita pedirlos de más.
   */
  const umbral = Number(texto('donaciones.umbral').replace(/\D/g, '')) || 0
  const debeDeclarar = tipo === 'patrocinio' || (esDinero && Number(monto || 0) >= umbral)

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
        ...(debeDeclarar
          ? {
              donanteTipo,
              documento: String(datos.get('documento') ?? ''),
              origenFondos: String(datos.get('origenFondos') ?? ''),
              esPep: datos.get('esPep') === 'on',
              declaraLicito: datos.get('declaraLicito') === 'on',
            }
          : {}),
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

            {/* ── De dónde salen los fondos ── */}
            {debeDeclarar && (
              <fieldset className="donacion-origen">
                <legend>
                  <i className="ti ti-shield-check" /> De dónde salen los fondos
                </legend>
                {texto('donaciones.avisoDeclaracion') && (
                  <p className="donacion-origen-aviso">{texto('donaciones.avisoDeclaracion')}</p>
                )}

                <div className="donacion-origen-tipo">
                  {(['persona', 'empresa'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`donacion-frec${donanteTipo === t ? ' esta-elegido' : ''}`}
                      onClick={() => setDonanteTipo(t)}
                      aria-pressed={donanteTipo === t}
                    >
                      {t === 'persona' ? 'Soy una persona' : 'Somos una empresa o institución'}
                    </button>
                  ))}
                </div>

                <div className="donacion-campos">
                  <div className="form-group">
                    <label htmlFor="d-documento">
                      {donanteTipo === 'persona' ? 'Cédula' : 'RNC'}
                    </label>
                    <input
                      id="d-documento"
                      name="documento"
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder={donanteTipo === 'persona' ? '000-0000000-0' : '000-00000-0'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="d-origen">Origen de los fondos</label>
                    <select id="d-origen" name="origenFondos" required defaultValue="">
                      <option value="">Elige una opción</option>
                      {(origenes ?? []).map((o) => (
                        <option key={o.id} value={o.nombre}>
                          {o.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="donacion-casilla">
                  <input type="checkbox" name="esPep" />
                  <span>
                    Ocupo o he ocupado un cargo público de alto nivel, o soy familiar cercano de
                    alguien que lo ocupa.
                    <small>
                      Marcarlo no impide donar. Solo pide que el Parque revise el aporte con más
                      detenimiento, como está obligado a hacer.
                    </small>
                  </span>
                </label>

                <label className="donacion-casilla es-obligatoria">
                  <input type="checkbox" name="declaraLicito" required />
                  <span>
                    Declaro que los fondos que ofrezco provienen de actividades lícitas y que la
                    información que doy aquí es verdadera.
                  </span>
                </label>
              </fieldset>
            )}

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
          {hayCuentas && (
            <div className="donacion-banco">
              <h2>
                <i className="ti ti-building-bank" /> Transferencia directa
              </h2>
              <p className="donacion-banco-intro">
                Si prefieres transferir sin esperar a que te contactemos, estas son las cuentas del
                Patronato.
              </p>

              {/* La tabla se desplaza dentro de su recuadro. Partir un número de
                  cuenta en dos líneas para que quepa es peor que desplazarlo. */}
              <div className="donacion-tabla-scroll">
                <table className="donacion-tabla">
                  <thead>
                    <tr>
                      <th>Banco</th>
                      <th>Tipo</th>
                      <th>Número de cuenta</th>
                      <th>A nombre de</th>
                      <th>RNC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuentas!.map((c) => (
                      <tr key={c.id}>
                        <td>
                          {c.banco}
                          {c.moneda === 'USD' && <span className="donacion-moneda">US$</span>}
                        </td>
                        <td>{c.tipoCuenta}</td>
                        <td className="es-cuenta">
                          {c.numero}
                          {c.nota && <small>{c.nota}</small>}
                        </td>
                        <td>{c.titular}</td>
                        <td>{c.rnc || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
