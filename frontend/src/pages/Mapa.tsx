import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type PuntoMapa } from '../api/client'

const MAPS_URL =
  'https://www.google.com/maps/place/Parque+Central+de+Santiago/@19.4667053,-70.695271,17z'

// Se reparten los colores de la paleta para que los marcadores se distingan.
const COLORES = [
  'var(--green-800)',
  'var(--green-400)',
  'var(--accent-400)',
  'var(--green-600)',
  'var(--accent-600)',
  'var(--green-900)',
]

export function Mapa() {
  const { data, loading, error } = useApiData(api.getPuntosMapa)
  const [activo, setActivo] = useState<number | null>(null)

  const puntos: PuntoMapa[] = data ?? []

  return (
    <>
      <PageHero
        label="El Parque"
        title="Mapa del Parque"
        description="Ubica las principales instalaciones del Parque Central de Santiago."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <p className="status-msg" style={{ marginTop: 0, marginBottom: 24 }}>
            Vista aérea del parque con las principales instalaciones señaladas. Las posiciones de
            los marcadores son referenciales y se ajustarán cuando el Parque entregue el plano
            oficial.
          </p>

          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && puntos.length === 0 && (
            <EmptyState
              icon="ti-map-pin"
              title="Sin puntos señalados"
              description="Todavía no se han marcado instalaciones sobre el mapa."
            />
          )}

          {puntos.length > 0 && (
            <div className="map-layout">
              <div className="map-plano">
                <img src="/images/galeria/vista-aerea-parque.jpg" alt="Vista aérea del parque" />

                {puntos.map((punto, i) => (
                  <button
                    type="button"
                    key={punto.id}
                    className={`map-pin${activo === punto.id ? ' is-activo' : ''}`}
                    style={{
                      top: `${punto.y}%`,
                      left: `${punto.x}%`,
                      background: COLORES[i % COLORES.length],
                    }}
                    title={punto.nombre}
                    aria-label={punto.nombre}
                    onClick={() => setActivo(activo === punto.id ? null : punto.id)}
                  >
                    {i + 1}
                    <span className="map-pin-tooltip">{punto.nombre}</span>
                  </button>
                ))}

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary map-plano-cta"
                >
                  <i className="ti ti-map-pin" /> Ver en Google Maps
                </a>
              </div>

              <div className="map-grid">
                {puntos.map((punto, i) => (
                  <button
                    type="button"
                    key={punto.id}
                    className={`map-card${activo === punto.id ? ' is-activo' : ''}`}
                    onClick={() => setActivo(activo === punto.id ? null : punto.id)}
                  >
                    <div className="map-card-img">
                      {punto.fotoUrl ? (
                        <img src={punto.fotoUrl} alt={punto.nombre} loading="lazy" />
                      ) : (
                        <span className="map-card-sinfoto">
                          <i className="ti ti-map-pin" />
                        </span>
                      )}
                      <span
                        className="map-card-badge"
                        style={{ background: COLORES[i % COLORES.length] }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <div className="map-card-info">
                      {punto.zona && <div className="map-card-cat">{punto.zona}</div>}
                      <div className="map-card-name">{punto.nombre}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
