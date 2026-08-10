import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { ParkMap } from '../components/ParkMap'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

const MAPS_URL =
  'https://www.google.com/maps/place/Parque+Central+de+Santiago/@19.4667053,-70.695271,17z'

export function Mapa() {
  const { data, loading, error } = useApiData(api.getPuntosMapa)
  const [activo, setActivo] = useState<number | null>(null)

  const puntos = data ?? []

  return (
    <>
      <PageHero
        pagina="mapa"
        label="El Parque"
        title="Mapa del Parque"
        description="Ubica las principales instalaciones del Parque Central de Santiago."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <p className="status-msg" style={{ marginTop: 0, marginBottom: 20 }}>
            Mapa interactivo con las principales instalaciones. Haz clic en un marcador o en una
            ficha para ubicarla. Las posiciones son aproximadas y se ajustarán cuando el Parque
            entregue las ubicaciones exactas.
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
              <ParkMap puntos={puntos} alto={480} activo={activo} onSeleccionar={setActivo} />

              <div className="map-grid">
                {puntos.map((punto, i) => (
                  <button
                    type="button"
                    key={punto.id}
                    className={`map-card${activo === punto.id ? ' is-activo' : ''}`}
                    onClick={() => setActivo(punto.id)}
                  >
                    <div className="map-card-img">
                      {punto.fotoUrl ? (
                        <img src={punto.fotoUrl} alt={punto.nombre} loading="lazy" />
                      ) : (
                        <span className="map-card-sinfoto">
                          <i className="ti ti-map-pin" />
                        </span>
                      )}
                      <span className="map-card-badge">{i + 1}</span>
                    </div>
                    <div className="map-card-info">
                      {punto.zona && <div className="map-card-cat">{punto.zona}</div>}
                      <div className="map-card-name">{punto.nombre}</div>
                    </div>
                  </button>
                ))}
              </div>

              <a href={MAPS_URL} target="_blank" rel="noopener" className="btn-outline">
                <i className="ti ti-map-2" /> Cómo llegar en Google Maps
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
