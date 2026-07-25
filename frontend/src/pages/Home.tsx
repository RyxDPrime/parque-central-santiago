import { Link } from 'react-router-dom'

const quickLinks = [
  {
    to: '/instalaciones-y-servicios',
    icon: 'ti-building',
    title: 'Instalaciones y Servicios',
    description: 'Canchas, campos de fútbol, kioscos, Cibao Fútbol Club, tirolesa y más.',
  },
  {
    to: '/programas-y-proyectos',
    icon: 'ti-plant-2',
    title: 'Programas y Proyectos',
    description: 'Las iniciativas del parque para la comunidad de Santiago.',
  },
  {
    to: '/junta-directiva',
    icon: 'ti-users',
    title: 'Junta Directiva',
    description: 'Las instituciones que conforman el Patronato para la Administración del Parque.',
  },
  {
    to: '/actividades',
    icon: 'ti-calendar-event',
    title: 'Actividades',
    description: 'La agenda de eventos del parque.',
  },
  {
    to: '/galeria',
    icon: 'ti-photo',
    title: 'Galería',
    description: 'Fotografías del parque y sus espacios.',
  },
  {
    to: '/contacto',
    icon: 'ti-map-pin',
    title: 'Contacto y Ubicación',
    description: 'Dirección, horario, teléfono y formulario de contacto.',
  },
]

export function Home() {
  return (
    <>
      <section id="home-hero">
        <img
          src="/images/galeria/vista-aerea-parque.jpg"
          alt="Vista aérea del Parque Central de Santiago"
          className="hero-bg"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <span />
            <span>Abierto hoy · 5:30 a.m. – 9:00 p.m.</span>
          </div>
          <h1>El pulmón verde de Santiago</h1>
          <p>
            Un espacio para la recreación, el deporte, la cultura y la convivencia ciudadana,
            administrado por el Patronato para la Administración del Parque Central de Santiago
            desde 2018.
          </p>
          <div className="hero-btns">
            <Link to="/instalaciones-y-servicios" className="btn-primary">
              <i className="ti ti-run" /> Ver instalaciones y servicios
            </Link>
            <Link to="/contacto" className="btn-outline-white">
              <i className="ti ti-map-2" /> Cómo llegar
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="sec-label">Explora el parque</div>
          <h2 className="sec-title">Todo lo que necesitas saber</h2>
          <p className="sec-sub">
            Conoce las instalaciones, programas y la institución que administra el Parque Central
            de Santiago.
          </p>
          <div className="quick-grid">
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className="quick-card">
                <div className="quick-card-icon">
                  <i className={`ti ${item.icon}`} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="section-inner">
          <div className="sec-label">Quiénes somos</div>
          <h2 className="sec-title">Una institución al servicio de Santiago</h2>
          <p className="sec-sub">
            El Parque Central de Santiago es administrado por un patronato sin fines de lucro,
            nacido del esfuerzo de casi veinte años de la Asociación para el Desarrollo, Inc.
            (APEDI) junto a instituciones públicas y privadas de la región.
          </p>
          <Link to="/sobre-el-parque" className="btn-outline" style={{ marginTop: 20 }}>
            Conoce nuestra historia <i className="ti ti-arrow-right" />
          </Link>
        </div>
      </section>
    </>
  )
}
