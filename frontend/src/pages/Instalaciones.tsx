import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

// Fotos que venían escritas aquí antes de que las instalaciones tuvieran su
// propio campo. Se conservan como respaldo de los registros que ya las usaban;
// lo que se cargue desde el panel manda sobre esta lista.
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

/** Foto cargada desde el panel; si no hay, la que estaba escrita por nombre. */
function fotoDeInstalacion(inst: { nombre: string; fotoUrl: string | null }) {
  return inst.fotoUrl || instalacionFotos[inst.nombre] || null
}

export function Instalaciones() {
  const instalaciones = useApiData(api.getInstalaciones)

  const conFoto = instalaciones.data?.filter((i) => fotoDeInstalacion(i)) ?? []
  const sinFoto = instalaciones.data?.filter((i) => !fotoDeInstalacion(i)) ?? []

  return (
    <>
      <PageHero
        pagina="instalaciones"
        label="El Parque"
        title="Instalaciones"
        description="Las áreas y facilidades del Parque Central de Santiago."
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
                    <img src={fotoDeInstalacion(inst)!} alt={inst.nombre} loading="lazy" />
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
    </>
  )
}
