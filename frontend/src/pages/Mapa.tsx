import { PageHero } from '../components/PageHero'

const zonas = [
  {
    letra: 'A',
    color: 'var(--green-800)',
    top: '10%',
    left: '55%',
    categoria: 'Zona Norte',
    nombre: 'Canchas de Baloncesto',
    foto: '/images/galeria/cancha-basketball.jpg',
  },
  {
    letra: 'B',
    color: 'var(--green-400)',
    top: '30%',
    left: '18%',
    categoria: 'Zona Norte',
    nombre: 'Canchas de Tenis',
    foto: '/images/galeria/cancha-tenis.jpg',
  },
  {
    letra: 'C',
    color: 'var(--accent-400)',
    top: '48%',
    left: '40%',
    categoria: 'Zona Central',
    nombre: 'Campos de Fútbol',
    foto: '/images/galeria/campo-futbol.jpg',
  },
  {
    letra: 'D',
    color: 'var(--green-600)',
    top: '68%',
    left: '20%',
    categoria: 'Zona Sur',
    nombre: 'Área Infantil',
    foto: '/images/galeria/parque-infantil.jpg',
  },
  {
    letra: 'E',
    color: 'var(--accent-600)',
    top: '72%',
    left: '62%',
    categoria: 'Zona Sur',
    nombre: 'Canchas de Voleibol',
    foto: '/images/galeria/voleibol.jpg',
  },
  {
    letra: 'F',
    color: 'var(--green-900)',
    top: '85%',
    left: '38%',
    categoria: 'Zona Sur',
    nombre: 'Áreas de Picnic',
    foto: '/images/galeria/gimnasio-aire-libre.jpg',
  },
]

export function Mapa() {
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
            Distribución referencial mientras incorporamos el plano oficial del parque.
          </p>

          <div className="map-layout">
            <div className="map-illustration">
              {zonas.map((z) => (
                <div
                  key={z.letra}
                  className="map-pin"
                  style={{ top: z.top, left: z.left, background: z.color }}
                >
                  {z.letra}
                </div>
              ))}
              <a
                href="https://www.google.com/maps/place/Parque+Central+de+Santiago/@19.4667053,-70.695271,17z"
                target="_blank"
                rel="noopener"
                className="btn-primary map-illustration-cta"
              >
                <i className="ti ti-map-pin" /> Ver en Google Maps
              </a>
            </div>

            <div className="map-grid">
              {zonas.map((z) => (
                <div key={z.letra} className="map-card">
                  <div className="map-card-img">
                    <img src={z.foto} alt={z.nombre} />
                    <span className="map-card-badge" style={{ background: z.color }}>
                      {z.letra}
                    </span>
                  </div>
                  <div className="map-card-info">
                    <div className="map-card-cat">{z.categoria}</div>
                    <div className="map-card-name">{z.nombre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
