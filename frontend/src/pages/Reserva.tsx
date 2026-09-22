import { type FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api, type EspacioReservable } from '../api/client'
import { ListaDeReglas, reglasDeLoElegido } from '../components/ListaDeReglas'

/**
 * Solicitud de reserva de espacios.
 *
 * Sigue el mismo recorrido que el préstamo de salas de la biblioteca de la
 * PUCMM, que es la referencia que pidió el Parque: primero las normas, luego el
 * horario, luego lo que ya está ocupado, y solo al final el formulario. El
 * orden importa: quien llega a los campos ya sabe si lo que iba a pedir procede.
 *
 * Lo que se envía es una SOLICITUD. Nada queda apartado hasta que el Parque
 * responda, y la página lo dice tres veces —arriba, junto al botón y en la
 * pantalla de gracias— porque es el malentendido que cuesta caro: alguien llena
 * esto un martes y se presenta el domingo creyendo que el kiosco es suyo.
 */

/** Lo que el parque puede facilitar. Se manda como una línea de texto. */
const REQUERIMIENTOS = [
  'Electricidad',
  'Mesas y sillas',
  'Equipo de sonido',
  'Parqueo para autobús',
  'Acceso para vehículo de carga',
  'Área para inflables',
]

/** El parque abre a las 5:30 a.m.; se ofrecen horas en punto de 6 a 9. */
const HORAS = Array.from({ length: 16 }, (_, i) => String(i + 6).padStart(2, '0') + ':00')

function hoyIso(): string {
  const ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset())
  return ahora.toISOString().slice(0, 10)
}

function fechaLarga(iso: string): string {
  const fecha = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(fecha.getTime())) return iso
  return fecha.toLocaleDateString('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

type Estado =
  | { tipo: 'listo' }
  | { tipo: 'enviando' }
  | { tipo: 'enviado' }
  | { tipo: 'error'; texto: string }

export function Reserva() {
  const texto = useTextos()
  const { data: pasos } = useApiData(api.getPasosReserva)
  const { data: espacios } = useApiData(api.getEspaciosReservables)
  const { data: tipos } = useApiData(api.getTiposActividad)
  const { data: ocupadas } = useApiData(api.getReservasOcupadas)
  const { data: reglas } = useApiData(api.getReglasUso)

  const [fecha, setFecha] = useState('')
  const [espacioId, setEspacioId] = useState('')
  const [tipoActividad, setTipoActividad] = useState('')
  const [personas, setPersonas] = useState('')
  const [extras, setExtras] = useState<string[]>([])
  const [normasAbiertas, setNormasAbiertas] = useState(false)
  const [estado, setEstado] = useState<Estado>({ tipo: 'listo' })

  const permitidos = useMemo(() => (tipos ?? []).filter((t) => t.permitido), [tipos])
  const noPermitidos = useMemo(() => (tipos ?? []).filter((t) => !t.permitido), [tipos])

  const espacio: EspacioReservable | undefined = (espacios ?? []).find(
    (e) => String(e.id) === espacioId,
  )

  // Lo que ya está apartado el día elegido. Es el equivalente al calendario que
  // la biblioteca muestra junto al formulario, pero solo del día que interesa.
  const ocupadasDelDia = useMemo(
    () => (ocupadas ?? []).filter((o) => o.fecha === fecha),
    [ocupadas, fecha],
  )

  // El trámite elegido decide dos cosas: qué datos se le piden y qué reglas se
  // le enseñan. Por eso vive en el estado y no solo en el campo del formulario.
  const tipoElegido = (tipos ?? []).find((t) => t.nombre === tipoActividad)
  const reglasAplicables = reglasDeLoElegido(reglas, tipoActividad, espacio?.nombre ?? '')

  // Un espacio que el Parque no reserva no puede aceptarse aquí: la solicitud
  // llegaría a una bandeja donde nadie puede aprobarla.
  const noLoReservaElParque = espacio !== undefined && espacio.gestion !== 'parque'

  const excedeCapacidad =
    espacio?.capacidad != null && Number(personas) > espacio.capacidad && Number(personas) > 0

  function alternarExtra(valor: string) {
    setExtras((actuales) =>
      actuales.includes(valor) ? actuales.filter((x) => x !== valor) : [...actuales, valor],
    )
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formulario = event.currentTarget
    const datos = new FormData(formulario)
    setEstado({ tipo: 'enviando' })

    try {
      await api.enviarSolicitudReserva({
        nombre: String(datos.get('nombre') ?? ''),
        cedula: String(datos.get('cedula') ?? ''),
        email: String(datos.get('email') ?? ''),
        telefono: String(datos.get('telefono') ?? ''),
        institucion: String(datos.get('institucion') ?? '') || undefined,
        espacio: espacio?.nombre ?? '',
        tipoActividad: String(datos.get('tipoActividad') ?? ''),
        fecha: String(datos.get('fecha') ?? ''),
        horaInicio: String(datos.get('horaInicio') ?? ''),
        horaFin: String(datos.get('horaFin') ?? ''),
        personas: Number(datos.get('personas') ?? 0),
        requerimientos: extras.join(', '),
        descripcion: String(datos.get('descripcion') ?? ''),
        // Vacíos se omiten: el servidor los trata como "no hay montaje", no
        // como una fecha invalida.
        montajeFecha: String(datos.get('montajeFecha') ?? '') || undefined,
        montajeHora: String(datos.get('montajeHora') ?? '') || undefined,
        desmontajeFecha: String(datos.get('desmontajeFecha') ?? '') || undefined,
        desmontajeHora: String(datos.get('desmontajeHora') ?? '') || undefined,
        acepta: true,
      })
      formulario.reset()
      setExtras([])
      setEspacioId('')
      setPersonas('')
      setFecha('')
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
      pagina="reserva"
      label="El Parque"
      title="Reserva de espacios"
      description="Solicita un kiosco, una cancha o un área del parque para tu actividad."
      image="/images/galeria/navidad-en-el-parque.jpg"
    />
  )

  if (estado.tipo === 'enviado') {
    return (
      <>
        {hero}
        <section className="section">
          <div className="reserva-inner">
            <div className="sugerencia-gracias">
              <div className="sugerencia-gracias-icono">
                <i className="ti ti-circle-check" />
              </div>
              <h2>Recibimos tu solicitud</h2>
              <p>
                Te enviamos un correo con el detalle de lo que pediste. El equipo del Parque la va a
                revisar y te responderá por esa misma vía.
              </p>
              <p className="reserva-gracias-aviso">
                <i className="ti ti-alert-circle" />
                <span>
                  Todavía no es una reserva. El espacio no está apartado a tu nombre hasta que
                  recibas la aprobación.
                </span>
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setEstado({ tipo: 'listo' })}
              >
                <i className="ti ti-plus" /> Enviar otra solicitud
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
        <div className="reserva-inner">
          {/* El malentendido caro, dicho antes que nada. */}
          <div className="reserva-aviso">
            <i className="ti ti-info-circle" />
            <div>
              <strong>Esto es una solicitud, no una reserva confirmada.</strong>
              <p>
                El equipo del Parque revisa cada solicitud y te responde por correo. El espacio no
                queda apartado hasta que recibas esa respuesta.
              </p>
            </div>
          </div>

          {/* ── Normas de uso ── */}
          <div className="reserva-normas">
            <button
              type="button"
              className="reserva-normas-boton"
              onClick={() => setNormasAbiertas((v) => !v)}
              aria-expanded={normasAbiertas}
            >
              <i className="ti ti-file-text" />
              <span>Antes de solicitar: cómo funciona y qué se puede pedir</span>
              <i
                className={`ti ti-chevron-${normasAbiertas ? 'up' : 'down'} reserva-normas-flecha`}
              />
            </button>

            {normasAbiertas && (
              <div className="reserva-normas-cuerpo">
                {pasos && pasos.length > 0 && (
                  <div className="reserva-normas-bloque">
                    <h3>Cómo funciona</h3>
                    <ol className="reserva-pasos">
                      {pasos.map((paso) => (
                        <li key={paso.id}>
                          <strong>{paso.titulo}.</strong> {paso.texto}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {noPermitidos.length > 0 && (
                  <div className="reserva-normas-bloque">
                    <h3>Lo que no se permite</h3>
                    <p className="reserva-normas-intro">
                      Estas actividades no proceden en el Parque. Si es tu caso, no hace falta que
                      llenes el formulario.
                    </p>
                    <ul className="reserva-no-permitidos">
                      {noPermitidos.map((t) => (
                        <li key={t.id}>
                          <i className="ti ti-x" />
                          <span>
                            {t.nombre}
                            {t.nota && <small> — {t.nota}</small>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="reserva-normas-bloque">
                  <h3>Horario del Parque</h3>
                  <p className="reserva-horario">
                    <span>
                      <i className="ti ti-clock" /> Parque: {texto('contacto.horarioParque')}
                    </span>
                    <span>
                      <i className="ti ti-briefcase" /> Oficina: {texto('contacto.horarioOficina')}
                    </span>
                  </p>
                  <p className="reserva-normas-intro">
                    Las solicitudes se revisan en horario de oficina.{' '}
                    {texto('reserva.calendarioTexto')}{' '}
                    <Link to="/actividades">Ver el calendario de actividades</Link>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Formulario ── */}
          <form className="reserva-form" onSubmit={enviar}>
            <fieldset className="reserva-grupo">
              <legend>
                <span className="reserva-grupo-num">1</span> Tus datos
              </legend>
              <div className="reserva-campos">
                <div className="form-group">
                  <label htmlFor="r-nombre">Nombre completo</label>
                  <input
                    id="r-nombre"
                    name="nombre"
                    type="text"
                    required
                    minLength={3}
                    placeholder="Como aparece en tu cédula"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="r-cedula">Cédula</label>
                  <input
                    id="r-cedula"
                    name="cedula"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="000-0000000-0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="r-email">Correo electrónico</label>
                  <input
                    id="r-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Aquí te llega la respuesta"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="r-telefono">Teléfono</label>
                  <input
                    id="r-telefono"
                    name="telefono"
                    type="tel"
                    required
                    placeholder="(809) 000-0000"
                  />
                </div>
                <div className="form-group form-group-ancho">
                  <label htmlFor="r-institucion">
                    Institución o empresa <span className="opcional">opcional</span>
                  </label>
                  <input
                    id="r-institucion"
                    name="institucion"
                    type="text"
                    placeholder="Si solicitas a nombre de una organización"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="reserva-grupo">
              <legend>
                <span className="reserva-grupo-num">2</span> Qué espacio necesitas
              </legend>
              <div className="reserva-campos">
                <div className="form-group">
                  <label htmlFor="r-espacio">Espacio</label>
                  <select
                    id="r-espacio"
                    name="espacioId"
                    required
                    value={espacioId}
                    onChange={(e) => setEspacioId(e.target.value)}
                  >
                    <option value="">Elige un espacio</option>
                    {(espacios ?? []).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nombre}
                        {e.cantidad ? ` (hay ${e.cantidad})` : ''}
                        {e.gestion !== 'parque' ? ' — se pide aparte' : ''}
                      </option>
                    ))}
                  </select>
                  {espacio && (
                    <small className="reserva-ayuda">
                      {espacio.descripcion}
                      {espacio.capacidad
                        ? ` Capacidad aproximada: ${espacio.capacidad} personas.`
                        : ''}
                    </small>
                  )}
                  {/* Este espacio no lo reserva el Parque: mandarle una solicitud
                      no lleva a ninguna parte, asi que se enseña a quién escribirle
                      y el formulario deja de aceptar el envío. */}
                  {espacio && espacio.gestion !== 'parque' && (
                    <p className="reserva-nota-tercero">
                      <i className={`ti ${espacio.gestion === 'libre' ? 'ti-info-circle' : 'ti-phone'}`} />
                      <span>
                        <b>
                          {espacio.gestion === 'libre'
                            ? 'Este espacio no necesita reserva.'
                            : 'Este espacio no lo reserva el Parque.'}
                        </b>{' '}
                        {espacio.contacto}
                      </span>
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="r-tipo">Tipo de actividad</label>
                  <select
                    id="r-tipo"
                    name="tipoActividad"
                    required
                    value={tipoActividad}
                    onChange={(e) => setTipoActividad(e.target.value)}
                  >
                    <option value="">Elige el tipo</option>
                    {permitidos.map((t) => (
                      <option key={t.id} value={t.nombre}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                  <small className="reserva-ayuda">
                    Si lo tuyo no está en la lista, escríbenos por{' '}
                    <Link to="/contacto">Contacto</Link> antes de solicitar.
                  </small>
                  {tipoElegido?.nota && (
                    <small className="reserva-ayuda">{tipoElegido.nota}</small>
                  )}
                </div>

                <div className="form-group form-group-medio">
                  <label htmlFor="r-personas">Cantidad de personas</label>
                  <input
                    id="r-personas"
                    name="personas"
                    type="number"
                    min={1}
                    max={5000}
                    required
                    value={personas}
                    onChange={(e) => setPersonas(e.target.value)}
                    placeholder="Aproximado"
                  />
                  {excedeCapacidad && (
                    <small className="reserva-ayuda es-alerta">
                      <i className="ti ti-alert-triangle" /> Ese espacio da para unas{' '}
                      {espacio?.capacidad} personas. Puedes enviarlo igual y el Parque te dirá si
                      hace falta otro.
                    </small>
                  )}
                </div>
              </div>

              {espacio?.requierePago && espacio.gestion === 'parque' && (
                <p className="reserva-nota-pago">
                  <i className="ti ti-cash" />
                  <span>
                    {espacio.aporte ? (
                      <>
                        Aporte por el uso de este espacio: <b>{espacio.aporte}</b>.{' '}
                      </>
                    ) : (
                      <>Este espacio tiene un costo de uso. </>
                    )}
                    No se cobra nada al solicitar: si la solicitud se aprueba, el Parque te indica
                    cómo y cuándo pagar.
                  </span>
                </p>
              )}

              {/* Las reglas de lo que acaba de elegir, aquí y no al final: leerlas
                  después de llenar todo el formulario es leerlas cuando ya no
                  sirven para decidir. Las generales no se repiten; viven en la
                  página de Condiciones, enlazada junto a la casilla de aceptar. */}
              {reglasAplicables.length > 0 && (
                <div className="reserva-reglas">
                  <p className="reserva-reglas-titulo">
                    <i className="ti ti-list-check" /> Lo que aplica a lo que elegiste
                  </p>
                  <ListaDeReglas reglas={reglasAplicables} compacta />
                </div>
              )}
            </fieldset>

            <fieldset className="reserva-grupo">
              <legend>
                <span className="reserva-grupo-num">3</span> Cuándo
              </legend>
              <div className="reserva-campos es-cuando">
                <div className="form-group">
                  <label htmlFor="r-fecha">Fecha</label>
                  <input
                    id="r-fecha"
                    name="fecha"
                    type="date"
                    required
                    min={hoyIso()}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="r-inicio">Hora de entrada</label>
                  <select id="r-inicio" name="horaInicio" required defaultValue="">
                    <option value="">Hora</option>
                    {HORAS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="r-fin">Hora de salida</label>
                  <select id="r-fin" name="horaFin" required defaultValue="">
                    <option value="">Hora</option>
                    {HORAS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lo ya apartado ese día: el equivalente al calendario que la
                  biblioteca muestra al lado, reducido al día que se pidió. */}
              {fecha && (
                <div className="reserva-ocupacion">
                  <h4>
                    <i className="ti ti-calendar-check" /> {fechaLarga(fecha)}
                  </h4>
                  {ocupadasDelDia.length === 0 ? (
                    <p className="reserva-ocupacion-libre">
                      No hay reservas aprobadas ese día. Eso no lo aparta: sigue haciendo falta que
                      el Parque apruebe la tuya.
                    </p>
                  ) : (
                    <ul className="reserva-ocupacion-lista">
                      {ocupadasDelDia.map((o) => (
                        <li key={o.id}>
                          <strong>{o.espacio}</strong>
                          <span>
                            {o.horaInicio} – {o.horaFin}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Montaje y desmontaje. Opcionales a propósito: quien pide un
                  kiosco para un cumpleaños no monta nada, y obligarle a llenar
                  cuatro campos vacíos es la forma más rápida de que abandone. */}
              <div className="reserva-montaje">
                <p className="reserva-montaje-titulo">
                  ¿Vas a montar algo antes? <span className="opcional">opcional</span>
                </p>
                <p className="reserva-ayuda">
                  Si tu actividad lleva carpas, tarima, sonido o cualquier estructura, dinos cuándo
                  entras a montarla y cuándo la retiras. El montaje solo puede hacerse en los días y
                  horarios que el Parque autorice.
                </p>
                <div className="form-row">
                  <div className="form-group form-group-medio">
                    <label htmlFor="r-montaje-fecha">Día del montaje</label>
                    <input id="r-montaje-fecha" name="montajeFecha" type="date" min={hoyIso()} />
                  </div>
                  <div className="form-group form-group-medio">
                    <label htmlFor="r-montaje-hora">Hora del montaje</label>
                    <select id="r-montaje-hora" name="montajeHora" defaultValue="">
                      <option value="">Sin definir</option>
                      {HORAS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group form-group-medio">
                    <label htmlFor="r-desmontaje-fecha">Día del desmontaje</label>
                    <input
                      id="r-desmontaje-fecha"
                      name="desmontajeFecha"
                      type="date"
                      min={hoyIso()}
                    />
                  </div>
                  <div className="form-group form-group-medio">
                    <label htmlFor="r-desmontaje-hora">Hora del desmontaje</label>
                    <select id="r-desmontaje-hora" name="desmontajeHora" defaultValue="">
                      <option value="">Sin definir</option>
                      {HORAS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="reserva-grupo">
              <legend>
                <span className="reserva-grupo-num">4</span> Detalles de la actividad
              </legend>

              <div className="form-group">
                <label htmlFor="r-descripcion">¿Qué van a hacer?</label>
                {tipoElegido?.datosPedidos && (
                  <small className="reserva-ayuda es-pedido">
                    <i className="ti ti-info-circle" /> Para {tipoElegido.nombre.toLowerCase()},
                    incluye también: {tipoElegido.datosPedidos}
                  </small>
                )}
                <textarea
                  id="r-descripcion"
                  name="descripcion"
                  rows={5}
                  required
                  minLength={15}
                  placeholder="Cuéntanos en qué consiste la actividad. Mientras más claro, más rápido se puede responder."
                />
              </div>

              <div className="form-group">
                <label>
                  ¿Necesitas algo del Parque? <span className="opcional">opcional</span>
                </label>
                <div className="reserva-extras">
                  {REQUERIMIENTOS.map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={`reserva-extra${extras.includes(r) ? ' esta-elegido' : ''}`}
                      onClick={() => alternarExtra(r)}
                      aria-pressed={extras.includes(r)}
                    >
                      <i className={`ti ti-${extras.includes(r) ? 'check' : 'plus'}`} />
                      {r}
                    </button>
                  ))}
                </div>
                <small className="reserva-ayuda">
                  Marcarlo no lo garantiza: el Parque confirma qué puede facilitar al responder.
                </small>
              </div>
            </fieldset>

            <label className="reserva-acepta">
              <input type="checkbox" name="acepta" required />
              <span>
                Leí las <Link to="/condiciones-de-uso">condiciones de uso</Link>, entiendo que esto es una solicitud y que el espacio no
                queda apartado hasta que el Parque me responda.
              </span>
            </label>

            {estado.tipo === 'error' && (
              <p className="form-feedback error">
                <i className="ti ti-alert-circle" /> {estado.texto}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary reserva-enviar"
              disabled={estado.tipo === 'enviando' || noLoReservaElParque}
            >
              <i className="ti ti-send" />
              {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviar solicitud'}
            </button>
            {noLoReservaElParque && (
              <p className="reserva-ayuda es-alerta" style={{ marginTop: 10 }}>
                <i className="ti ti-alert-triangle" /> Ese espacio se pide por su propia vía, no
                por este formulario. Arriba está a quién escribirle.
              </p>
            )}

            <p className="reserva-nota">
              Tus datos se usan solo para gestionar esta solicitud. No se comparten con nadie.
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
