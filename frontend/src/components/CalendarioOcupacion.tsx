import { useMemo, useState } from 'react'
import type { ReservaOcupada } from '../api/client'

/**
 * Calendario mensual de lo que ya está apartado.
 *
 * Va encima del formulario porque responde la pregunta con la que llega la
 * gente —«¿está libre el sábado?»— sin obligar a elegir una fecha a ciegas y
 * descubrir después que choca.
 *
 * Solo muestra reservas APROBADAS, y de cada una solo el espacio, el horario,
 * el tipo de actividad y cuánta gente. Ni el nombre de quien reservó ni lo que
 * escribió: eso se lo contó al Parque en privado.
 *
 * Al pulsar un día se abre su detalle debajo, no en un globo flotante: en un
 * teléfono un globo tapa justo lo que se quiere leer.
 */

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

/** "2026-09-22" sin pasar por Date, que corre el día según la zona horaria. */
function iso(anio: number, mes: number, dia: number): string {
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

function hoyIso(): string {
  const ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset())
  return ahora.toISOString().slice(0, 10)
}

/** "14:00" -> "2:00 p.m.", como se lee un horario aquí. */
function hora12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const sufijo = h < 12 ? 'a.m.' : 'p.m.'
  const doce = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${doce} ${sufijo}` : `${doce}:${String(m).padStart(2, '0')} ${sufijo}`
}

function fechaLarga(isoFecha: string): string {
  const [a, m, d] = isoFecha.split('-').map(Number)
  return `${DIAS[new Date(a, m - 1, d).getDay()]}, ${d} de ${MESES[m - 1]} de ${a}`
}

/** Las celdas del mes: los huecos del principio van como null. */
function celdasDelMes(anio: number, mes: number): (number | null)[] {
  const primerDia = new Date(anio, mes, 1).getDay()
  const dias = new Date(anio, mes + 1, 0).getDate()
  const celdas: (number | null)[] = Array(primerDia).fill(null)
  for (let d = 1; d <= dias; d++) celdas.push(d)
  // Se completa la última semana para que la rejilla no quede dentada.
  while (celdas.length % 7 !== 0) celdas.push(null)
  return celdas
}

interface Props {
  ocupadas: ReservaOcupada[] | null
  /** Al pulsar un día libre, se puede llevar esa fecha al formulario. */
  onElegirFecha?: (fecha: string) => void
  /** La fecha que el formulario tiene puesta, para marcarla. */
  fechaElegida?: string
}

export function CalendarioOcupacion({ ocupadas, onElegirFecha, fechaElegida }: Props) {
  const hoy = hoyIso()
  const [anio, setAnio] = useState(() => Number(hoy.slice(0, 4)))
  const [mes, setMes] = useState(() => Number(hoy.slice(5, 7)) - 1)
  const [diaAbierto, setDiaAbierto] = useState<string | null>(null)

  // Las reservas de cada día, indexadas por fecha: recorrer la lista entera por
  // cada celda serían treinta recorridos para pintar un mes.
  const porDia = useMemo(() => {
    const mapa = new Map<string, ReservaOcupada[]>()
    for (const o of ocupadas ?? []) {
      const lista = mapa.get(o.fecha)
      if (lista) lista.push(o)
      else mapa.set(o.fecha, [o])
    }
    return mapa
  }, [ocupadas])

  const celdas = celdasDelMes(anio, mes)

  function mover(pasos: number) {
    const fecha = new Date(anio, mes + pasos, 1)
    setAnio(fecha.getFullYear())
    setMes(fecha.getMonth())
    setDiaAbierto(null)
  }

  function alPulsarDia(fecha: string) {
    setDiaAbierto((actual) => (actual === fecha ? null : fecha))
    if (fecha >= hoy) onElegirFecha?.(fecha)
  }

  const delDiaAbierto = diaAbierto ? (porDia.get(diaAbierto) ?? []) : []

  return (
    <div className="calendario">
      <header className="calendario-barra">
        <div className="calendario-titulo">
          <h3>
            {MESES[mes].charAt(0).toUpperCase() + MESES[mes].slice(1)} {anio}
          </h3>
          <p>Lo que ya está apartado. Un día sin marcas está libre.</p>
        </div>
        <div className="calendario-mandos">
          <button
            type="button"
            onClick={() => {
              setAnio(Number(hoy.slice(0, 4)))
              setMes(Number(hoy.slice(5, 7)) - 1)
              setDiaAbierto(null)
            }}
          >
            Hoy
          </button>
          <button type="button" onClick={() => mover(-1)} aria-label="Mes anterior">
            <i className="ti ti-chevron-left" />
          </button>
          <button type="button" onClick={() => mover(1)} aria-label="Mes siguiente">
            <i className="ti ti-chevron-right" />
          </button>
        </div>
      </header>

      <div className="calendario-rejilla" role="grid" aria-label="Reservas aprobadas por día">
        {DIAS.map((d) => (
          <div key={d} className="calendario-cabecera" role="columnheader">
            {d}
          </div>
        ))}

        {celdas.map((dia, i) => {
          if (dia === null) return <div key={`hueco-${i}`} className="calendario-dia es-hueco" />

          const fecha = iso(anio, mes, dia)
          const delDia = porDia.get(fecha) ?? []
          const pasado = fecha < hoy
          const clases = [
            'calendario-dia',
            pasado ? 'es-pasado' : '',
            fecha === hoy ? 'es-hoy' : '',
            fecha === fechaElegida ? 'es-elegido' : '',
            fecha === diaAbierto ? 'esta-abierto' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              type="button"
              key={fecha}
              className={clases}
              onClick={() => alPulsarDia(fecha)}
              aria-label={`${dia} de ${MESES[mes]}: ${
                delDia.length === 0 ? 'sin reservas' : `${delDia.length} reserva${delDia.length > 1 ? 's' : ''}`
              }`}
              aria-pressed={fecha === diaAbierto}
            >
              <span className="calendario-numero">{dia}</span>
              {delDia.slice(0, 2).map((o) => (
                <span key={o.id} className="calendario-marca">
                  <i className="ti ti-point-filled" />
                  {hora12(o.horaInicio)} · {o.espacio}
                </span>
              ))}
              {delDia.length > 2 && (
                <span className="calendario-mas">{delDia.length - 2} más</span>
              )}
            </button>
          )
        })}
      </div>

      {diaAbierto && (
        <div className="calendario-detalle">
          <header>
            <h4>{fechaLarga(diaAbierto)}</h4>
            <button type="button" onClick={() => setDiaAbierto(null)} aria-label="Cerrar detalle">
              <i className="ti ti-x" />
            </button>
          </header>

          {delDiaAbierto.length === 0 ? (
            <p className="calendario-libre">
              <i className="ti ti-circle-check" /> No hay nada apartado ese día.{' '}
              {diaAbierto < hoy
                ? 'Es una fecha pasada.'
                : 'Que esté libre no lo aparta: sigue haciendo falta que el Parque apruebe tu solicitud.'}
            </p>
          ) : (
            <ul className="calendario-lista">
              {delDiaAbierto.map((o) => (
                <li key={o.id}>
                  <span className="calendario-horario">
                    {hora12(o.horaInicio)} – {hora12(o.horaFin)}
                  </span>
                  <span className="calendario-espacio">{o.espacio}</span>
                  <span className="calendario-meta">
                    {o.tipoActividad}
                    {o.personas ? ` · ${o.personas} personas` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="calendario-aviso">
            Un espacio ocupado a una hora puede estar libre a otra, y hay espacios de los que hay
            más de uno.
          </p>
        </div>
      )}
    </div>
  )
}
