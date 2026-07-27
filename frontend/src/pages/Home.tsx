import { Link } from 'react-router-dom'
import { ProgramsCarousel } from '../components/ProgramsCarousel'

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

      <section id="stats" aria-label="El parque en cifras">
        <div className="sec-label">Instalaciones</div>
        <h2 className="sec-title" style={{ marginBottom: 40 }}>
          El parque en cifras
        </h2>

        <div className="stat-row img-left">
          <div className="stat-img">
            <img src="/images/galeria/campo-futbol.jpg" alt="Campos de fútbol" />
            <div className="stat-img-label">
              <span className="img-pill">Complejo Deportivo</span>
            </div>
          </div>
          <div>
            <div className="stat-num">2 campos</div>
            <p className="stat-desc">
              Dos campos de fútbol reglamentarios, además de canchas de baloncesto, tenis,
              voleibol y disc golf para toda la comunidad.
            </p>
            <Link to="/instalaciones-y-servicios" className="stat-cta">
              Ver instalaciones y servicios <i className="ti ti-arrow-right" />
            </Link>
          </div>
        </div>

        <div className="stat-row img-right">
          <div>
            <div className="stat-num">17</div>
            <p className="stat-desc">
              Instituciones públicas y privadas conforman la Junta Directiva del Patronato para
              la Administración del Parque Central de Santiago.
            </p>
            <Link to="/junta-directiva" className="stat-cta">
              Conoce la Junta Directiva <i className="ti ti-arrow-right" />
            </Link>
          </div>
          <div className="stat-img">
            <img src="/images/galeria/entrada-parque.jpg" alt="Entrada del parque" />
            <div className="stat-img-label">
              <span className="img-pill">Patronato PCS</span>
            </div>
          </div>
        </div>

        <div className="stat-row two-col">
          <div>
            <div className="stat-img">
              <img src="/images/galeria/gimnasio-aire-libre.jpg" alt="Áreas de picnic y kioscos" />
              <div className="stat-img-label">
                <span className="img-pill">Áreas de Picnic</span>
              </div>
            </div>
            <div className="stat-num" style={{ fontSize: 40, marginTop: 16 }}>
              32 kioscos
            </div>
            <p className="stat-desc">8 grandes y 24 pequeños para reuniones familiares.</p>
          </div>
          <div>
            <div className="stat-img">
              <img src="/images/galeria/voleibol.jpg" alt="Parqueos del parque" />
              <div className="stat-img-label">
                <span className="img-pill">Parqueos</span>
              </div>
            </div>
            <div className="stat-num" style={{ fontSize: 40, marginTop: 16 }}>
              450
            </div>
            <p className="stat-desc">Espacios de estacionamiento para los visitantes.</p>
          </div>
        </div>

        <div className="stat-row img-right">
          <div>
            <div className="stat-num">2018</div>
            <p className="stat-desc">
              Año de inauguración del parque, resultado de casi dos décadas de gestión de la
              Asociación para el Desarrollo, Inc. (APEDI).
            </p>
            <Link to="/sobre-el-parque" className="stat-cta">
              Conoce nuestra historia <i className="ti ti-arrow-right" />
            </Link>
          </div>
          <div className="stat-img">
            <img src="/images/galeria/cancha-tenis.jpg" alt="Vista aérea del parque" />
            <div className="stat-img-label">
              <span className="img-pill">Desde 2018</span>
            </div>
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
        <div className="about-inner">
          <div>
            <div className="sec-label">Quiénes somos</div>
            <h2 className="sec-title">Una institución al servicio de Santiago</h2>
            <p className="sec-sub">
              El Parque Central de Santiago es administrado por un patronato sin fines de lucro,
              nacido del esfuerzo de casi veinte años de la Asociación para el Desarrollo, Inc.
              (APEDI) junto a instituciones públicas y privadas de la región.
            </p>
            <div className="about-links">
              <Link to="/sobre-el-parque" className="about-link">
                <i className="ti ti-book" /> Historia
              </Link>
              <Link to="/reglamento" className="about-link">
                <i className="ti ti-clipboard-list" /> Reglamento
              </Link>
              <Link to="/junta-directiva" className="about-link">
                <i className="ti ti-users" /> Junta Directiva
              </Link>
              <Link to="/personal-tecnico" className="about-link">
                <i className="ti ti-briefcase" /> Personal Técnico
              </Link>
              <Link to="/transparencia" className="about-link">
                <i className="ti ti-scale" /> Transparencia
              </Link>
            </div>
          </div>
          <div className="about-img">
            <div className="about-img-wrap">
              <img src="/images/galeria/carnaval-2025.jpg" alt="Vida comunitaria en el parque" />
            </div>
            <div className="about-badge">
              <div className="about-badge-icon">
                <i className="ti ti-calendar-event" />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>2018</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  año de fundación
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div className="sec-label">En desarrollo</div>
              <h2 className="sec-title" style={{ marginBottom: 0 }}>
                Programas y Proyectos
              </h2>
            </div>
            <Link to="/programas-y-proyectos" className="stat-cta" style={{ marginTop: 0 }}>
              Ver todos <i className="ti ti-arrow-right" />
            </Link>
          </div>
          <ProgramsCarousel />
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-100)' }}>
        <div className="section-inner">
          <div className="sec-label">Ubicación</div>
          <h2 className="sec-title">Explora el parque</h2>
          <p className="sec-sub">
            Ubica las principales instalaciones del Parque Central de Santiago en el mapa.
          </p>
          <Link to="/mapa" className="mini-map" style={{ display: 'block' }}>
            <div className="map-pin" style={{ top: '30%', left: '20%', background: 'var(--green-800)' }}>
              A
            </div>
            <div className="map-pin" style={{ top: '55%', left: '45%', background: 'var(--accent-400)' }}>
              B
            </div>
            <div className="map-pin" style={{ top: '35%', left: '72%', background: 'var(--green-400)' }}>
              C
            </div>
          </Link>
          <Link to="/mapa" className="btn-outline" style={{ marginTop: 20 }}>
            Ver mapa completo <i className="ti ti-arrow-right" />
          </Link>
        </div>
      </section>

      <section id="support">
        <i className="ti ti-heart" aria-hidden="true" />
        <h2>¿Quieres apoyar al parque?</h2>
        <p>
          Súmate como voluntario, patrocinador o aliado institucional y ayuda a mantener vivo el
          pulmón verde de Santiago de los Caballeros.
        </p>
        <div className="support-btns">
          <Link to="/apoyanos" className="btn-light">
            <i className="ti ti-cash" /> Hacer una donación
          </Link>
          <Link to="/apoyanos" className="btn-outline-white">
            <i className="ti ti-run" /> Ser voluntario
          </Link>
          <Link to="/apoyanos" className="btn-outline-white">
            <i className="ti ti-plant" /> Donar un árbol
          </Link>
        </div>
      </section>
    </>
  )
}
