import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { ActividadModal } from '../components/ActividadModal'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type Actividad as ActividadData } from '../api/client'

const monthLabelFormatter = new Intl.DateTimeFormat('es-DO', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const dayFormatter = new Intl.DateTimeFormat('es-DO', { day: 'numeric', timeZone: 'UTC' })
const monthShortFormatter = new Intl.DateTimeFormat('es-DO', { month: 'short', timeZone: 'UTC' })
const rangeFormatter = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', timeZone: 'UTC' })

function formatRango(actividad: ActividadData): string {
  const inicio = rangeFormatter.format(new Date(actividad.fechaInicio))
  if (!actividad.fechaFin) return inicio
  const fin = rangeFormatter.format(new Date(actividad.fechaFin))
  return `${inicio} – ${fin}`
}

/**
 * Hoy, en la hora del Parque.
 *
 * No se usa la del visitante ni la del servidor: la agenda es de Santiago, y
 * quien la mire desde Madrid no debería ver julio desaparecer medio día antes
 * que quien la mire desde aquí.
 *
 * Devuelve "2026-08-27", que se compara como texto sin sorpresas.
 */
const diaFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Santo_Domingo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function hoyEnElParque(): string {
  return diaFormatter.format(new Date())
}

/** "2026-07-31" a partir de una fecha guardada. */
function diaDe(fecha: string): string {
  return new Date(fecha).toISOString().slice(0, 10)
}

function groupByMonth(actividades: ActividadData[]) {
  const groups = new Map<string, ActividadData[]>()
  for (const actividad of actividades) {
    const date = new Date(actividad.fechaInicio)
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
    const list = groups.get(key) ?? []
    list.push(actividad)
    groups.set(key, list)
  }
  return Array.from(groups.entries()).map(([key, items]) => ({
    label: monthLabelFormatter.format(new Date(items[0].fechaInicio)),
    key,
    items,
  }))
}

/**
 * Fuera los meses que ya pasaron.
 *
 * Un mes desaparece entero cuando termina, no actividad por actividad: dentro
 * del mes en curso se siguen viendo todas, incluidas las de días pasados,
 * porque a mitad de mes la gente todavía pregunta por lo que hubo la semana
 * anterior.
 *
 * La excepción son las actividades a caballo entre dos meses. Una que va del
 * 31 de julio al 2 de agosto mantiene vivo el grupo de julio, pero solo hasta
 * que de verdad acaba: se compara por día y no por mes, o julio se quedaría
 * colgado el agosto entero por un evento que terminó el día 2.
 *
 * Esto solo cambia lo que se muestra. En el panel siguen todas, y el Parque
 * conserva el registro de lo que hizo.
 */
function soloVigentes(grupos: ReturnType<typeof groupByMonth>) {
  const hoy = hoyEnElParque()
  const mesEnCurso = hoy.slice(0, 7)

  return grupos.filter((grupo) => {
    const mesDelGrupo = diaDe(grupo.items[0].fechaInicio).slice(0, 7)
    if (mesDelGrupo >= mesEnCurso) return true
    return grupo.items.some((a) => diaDe(a.fechaFin ?? a.fechaInicio) >= hoy)
  })
}

export function Actividades() {
  const { data, loading, error } = useApiData(api.getActividades)
  const groups = data ? soloVigentes(groupByMonth(data)) : []
  const [abierta, setAbierta] = useState<ActividadData | null>(null)

  return (
    <>
      <PageHero
        pagina="actividades"
        label="El Parque"
        title="Actividades"
        description="La agenda de eventos y actividades del Parque Central de Santiago."
        image="/images/galeria/maraton-5k.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {/* Tambien cuando hay actividades pero todas ya pasaron: sin esto la
              pagina se quedaria en blanco y pareceria rota. */}
          {data && groups.length === 0 && (
            <EmptyState
              icon="ti-calendar-event"
              title="Agenda en preparación"
              description="No hay actividades programadas por ahora. El calendario se actualiza cada mes; síguenos en redes sociales para no perderte los próximos eventos."
            />
          )}

          {groups.map((group) => (
            <div className="agenda-month" key={group.key}>
              <h2 className="agenda-month-title">{group.label}</h2>
              <div className="agenda-timeline">
                {group.items.map((actividad) => (
                  // Es un botón y no un div: se abre con el teclado igual que
                  // con el mouse, y los lectores de pantalla lo anuncian.
                  <button
                    type="button"
                    className="agenda-item"
                    key={actividad.id}
                    onClick={() => setAbierta(actividad)}
                    aria-label={`Ver detalles de ${actividad.titulo}`}
                  >
                    <div className="agenda-date-badge">
                      <span className="agenda-day">{dayFormatter.format(new Date(actividad.fechaInicio))}</span>
                      <span className="agenda-mon">{monthShortFormatter.format(new Date(actividad.fechaInicio))}</span>
                    </div>
                    <div className="agenda-content">
                      <span className="agenda-range">{formatRango(actividad)}</span>
                      <h3>{actividad.titulo}</h3>
                      {actividad.lugar && (
                        <p className="agenda-lugar">
                          <i className="ti ti-map-pin" /> {actividad.lugar}
                        </p>
                      )}
                      {actividad.descripcion && <p className="agenda-desc">{actividad.descripcion}</p>}
                      <span className="agenda-mas">
                        Ver detalles <i className="ti ti-arrow-right" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {abierta && <ActividadModal actividad={abierta} onClose={() => setAbierta(null)} />}
    </>
  )
}
