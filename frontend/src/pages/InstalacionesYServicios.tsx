import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

const instalacionFotos: Record<string, string> = {
  'Canchas de Baloncesto': '/images/galeria/cancha-basketball.jpg',
  'Canchas de Tenis': '/images/galeria/cancha-tenis.jpg',
  'Canchas de Voleibol': '/images/galeria/voleibol.jpg',
  'Campos de Fútbol': '/images/galeria/campo-futbol.jpg',
  'Área Infantil': '/images/galeria/parque-infantil.jpg',
}

const instalacionIconos: Record<string, string> = {
  'Cancha de Disc Golf': 'ti-disc',
  Anfiteatro: 'ti-music',
  'Áreas de Picnic': 'ti-tree',
  'Kioscos Grandes': 'ti-home',
  'Kioscos Pequeños': 'ti-home',
  Parqueos: 'ti-car',
  'Área para Ferias y Eventos': 'ti-calendar-event',
  Hangares: 'ti-building',
}

const servicioFotos: Record<string, string> = {
  'Cibao Fútbol Club': '/images/galeria/cibao-futbol-club.jpg',
  'Escuela de Tenis – Washington Heights Tennis Association': '/images/galeria/cancha-tenis.jpg',
  Tirolesa: '/images/galeria/ciclistas.jpg',
  'Fun Stop – Carritos Corredores': '/images/galeria/funstop.jpg',
}

export function InstalacionesYServicios() {
  const instalaciones = useApiData(api.getInstalaciones)
  const programas = useApiData(api.getProgramas)

  const conFoto = instalaciones.data?.filter((i) => instalacionFotos[i.nombre]) ?? []
  const sinFoto = instalaciones.data?.filter((i) => !instalacionFotos[i.nombre]) ?? []

  return (
    <>
      <PageHero
        label="El Parque"
        title="Instalaciones y Servicios"
        description="Las áreas y facilidades del parque, y los servicios que ofrece a la comunidad de Santiago."
        image="/images/galeria/cancha-basketball.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="sec-label">Áreas y facilidades</div>
          <h2 className="sec-title">Instalaciones del parque</h2>

          {instalaciones.loading && <LoadingState />}
          {instalaciones.error && <ErrorState message={instalaciones.error} />}

          {instalaciones.data && (
            <>
              <div className="facility-photo-grid">
                {conFoto.map((inst) => (
                  <div key={inst.id} className="facility-photo-card">
                    <img src={instalacionFotos[inst.nombre]} alt={inst.nombre} />
                    <div className="facility-photo-overlay">
                      {inst.cantidad !== null && <span className="facility-photo-badge">{inst.cantidad}</span>}
                      <h3>{inst.nombre}</h3>
                      <p>{inst.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="facility-icon-grid">
                {sinFoto.map((inst) => (
                  <div key={inst.id} className="facility-icon-card">
                    <div className="facility-icon-badge">
                      <i className={`ti ${instalacionIconos[inst.nombre] ?? 'ti-map-pin'}`} />
                    </div>
                    <div>
                      <div className="facility-icon-head">
                        <h3>{inst.nombre}</h3>
                        {inst.cantidad !== null && <span className="badge">{inst.cantidad}</span>}
                      </div>
                      <p>{inst.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="section-inner">
          <div className="sec-label">Actividades para la comunidad</div>
          <h2 className="sec-title" style={{ marginBottom: 40 }}>
            Servicios que ofrecemos
          </h2>

          {programas.loading && <LoadingState />}
          {programas.error && <ErrorState message={programas.error} />}

          {programas.data?.map((programa, i) => (
            <div className={`service-row ${i % 2 === 1 ? 'reverse' : ''}`} key={programa.id}>
              <div className="service-row-img">
                <img src={servicioFotos[programa.nombre] ?? '/images/galeria/entrada-parque.jpg'} alt={programa.nombre} />
              </div>
              <div className="service-row-text">
                <span className="tag">{programa.categoria}</span>
                <h3>{programa.nombre}</h3>
                <p>{programa.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
