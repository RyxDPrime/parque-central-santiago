import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function InstalacionesYServicios() {
  const instalaciones = useApiData(api.getInstalaciones)
  const programas = useApiData(api.getProgramas)

  return (
    <>
      <PageHero
        label="El Parque"
        title="Instalaciones y Servicios"
        description="Las áreas y facilidades del parque, y los servicios que ofrece a la comunidad de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <div className="sec-label">Áreas y facilidades</div>
          <h2 className="sec-title">Instalaciones del parque</h2>

          {instalaciones.loading && <LoadingState />}
          {instalaciones.error && <ErrorState message={instalaciones.error} />}

          {instalaciones.data && (
            <div className="card-grid">
              {instalaciones.data.map((inst) => (
                <div key={inst.id} className="info-card">
                  <div className="info-card-head">
                    <h3>{inst.nombre}</h3>
                    {inst.cantidad !== null && <span className="badge">{inst.cantidad}</span>}
                  </div>
                  <p>{inst.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="section-inner">
          <div className="sec-label">Actividades para la comunidad</div>
          <h2 className="sec-title">Servicios que ofrecemos</h2>

          {programas.loading && <LoadingState />}
          {programas.error && <ErrorState message={programas.error} />}

          {programas.data && (
            <div className="card-grid">
              {programas.data.map((programa) => (
                <div key={programa.id} className="info-card">
                  <span className="tag">{programa.categoria}</span>
                  <h3 style={{ marginBottom: 8 }}>{programa.nombre}</h3>
                  <p>{programa.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
