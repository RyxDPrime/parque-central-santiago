import { Link } from 'react-router-dom'
import { ProgramsCarousel } from '../components/ProgramsCarousel'
import { AnnouncementPopup } from '../components/AnnouncementPopup'
import { ParkMap } from '../components/ParkMap'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { useEncabezado } from '../hooks/useEncabezado'
import { api, type Cifra } from '../api/client'

/**
 * Vista reducida del mapa. Toma los mismos puntos que la página de Mapa: antes
 * eran tres marcadores fijos (A, B, C) escritos a mano, que no correspondían
 * con las instalaciones reales.
 */
function MiniMapa() {
  const { data } = useApiData(api.getPuntosMapa)
  if (!data || data.length === 0) return null
  return <ParkMap puntos={data} alto={340} estatico />
}

/**
 * Cifras destacadas del inicio. Antes estaban escritas dentro de la página con
 * su imagen y su enlace; ahora se editan desde el panel.
 */
function CifrasDestacadas() {
  const { data } = useApiData(api.getCifras)
  const texto = useTextos()
  if (!data || data.length === 0) return null

  return (
    <section id="stats" aria-label="El parque en cifras">
      <div className="sec-label">{texto('inicio.cifrasEtiqueta')}</div>
      <h2 className="sec-title" style={{ marginBottom: 40 }}>
        {texto('inicio.cifrasTitulo')}
      </h2>

      {data.map((cifra, i) => (
        <div className={`stat-row ${i % 2 === 0 ? 'img-left' : 'img-right'}`} key={cifra.id}>
          {i % 2 === 0 && <CifraImagen cifra={cifra} />}
          <div>
            {/* Algunas "cifras" son en realidad un título ("Instalaciones y
                espacios"): a ese largo, los 56px del número no caben en la
                columna, así que baja a tamaño de titular. */}
            <div className={`stat-num${cifra.numero.length > 12 ? ' is-titulo' : ''}`}>
              {cifra.numero}
            </div>
            <p className="stat-desc">{cifra.descripcion}</p>
            {cifra.enlaceTexto && cifra.enlaceUrl && (
              <Link to={cifra.enlaceUrl} className="stat-cta">
                {cifra.enlaceTexto} <i className="ti ti-arrow-right" />
              </Link>
            )}
          </div>
          {i % 2 === 1 && <CifraImagen cifra={cifra} />}
        </div>
      ))}
    </section>
  )
}

/**
 * Foto del bloque "Quiénes somos". Se guarda junto a las de encabezado para
 * que el panel la pueda cambiar sin tocar el código, igual que las demás.
 */
function FotoQuienesSomos() {
  const guardado = useEncabezado('inicio-quienes')
  const foto = guardado.configurado
    ? guardado.imagen
    : '/images/galeria/vista-aerea-parque.jpg'
  if (!foto) return null
  return (
    <img
      src={foto}
      alt="Vista del Parque Central de Santiago"
      style={guardado.posicion ? { objectPosition: guardado.posicion } : undefined}
    />
  )
}

function CifraImagen({ cifra }: { cifra: Cifra }) {
  if (!cifra.imagenUrl) return <div />
  return (
    <div className="stat-img">
      <img src={cifra.imagenUrl} alt={cifra.etiqueta ?? cifra.numero} />
      {cifra.etiqueta && (
        <div className="stat-img-label">
          <span className="img-pill">{cifra.etiqueta}</span>
        </div>
      )}
    </div>
  )
}

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
  const texto = useTextos()
  const portada = useEncabezado('inicio')

  return (
    <>
      <AnnouncementPopup />

      <section id="home-hero">
        <img
          src={portada.imagen ?? '/images/galeria/vista-aerea-parque.jpg'}
          alt="Vista aérea del Parque Central de Santiago"
          className="hero-bg"
          style={portada.posicion ? { objectPosition: portada.posicion } : undefined}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <span />
            <span>Abierto hoy · 5:30 a.m. – 9:00 p.m.</span>
          </div>
          <h1>{texto('inicio.heroTitulo')}</h1>
          <p>{texto('inicio.heroTexto')}</p>
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

      <CifrasDestacadas />

      <section className="section">
        <div className="section-inner">
          <div className="sec-label">{texto('inicio.exploraEtiqueta')}</div>
          <h2 className="sec-title">{texto('inicio.exploraTitulo')}</h2>
          <p className="sec-sub">{texto('inicio.exploraTexto')}</p>
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
            <div className="sec-label">{texto('inicio.quienesEtiqueta')}</div>
            <h2 className="sec-title">{texto('inicio.quienesTitulo')}</h2>
            <p className="sec-sub">{texto('inicio.quienesTexto')}</p>
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
              <FotoQuienesSomos />
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

      <section className="section" id="home-map" style={{ background: 'var(--gray-100)' }}>
        <div className="section-inner">
          <div className="sec-label">{texto('inicio.mapaEtiqueta')}</div>
          <h2 className="sec-title">{texto('inicio.mapaTitulo')}</h2>
          <p className="sec-sub">{texto('inicio.mapaTexto')}</p>
          <MiniMapa />
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
