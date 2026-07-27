import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <nav id="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          <img src="/images/brand/logo-pcs.png" alt="Parque Central de Santiago" className="brand-logo" />
        </NavLink>

        <div className="nav-links">
          <div className="nav-item">
            <NavLink to="/" end>
              Inicio
            </NavLink>
          </div>

          <div className="nav-item">
            <button type="button">
              Sobre Nosotros <i className="ti ti-chevron-down" style={{ fontSize: 12 }} />
            </button>
            <div className="dropdown">
              <NavLink to="/sobre-el-parque">
                <i className="ti ti-book" />
                Historia
              </NavLink>
              <NavLink to="/mision-y-vision">
                <i className="ti ti-target" />
                Misión y Visión
              </NavLink>
              <NavLink to="/valores">
                <i className="ti ti-heart" />
                Valores
              </NavLink>
              <NavLink to="/reglamento">
                <i className="ti ti-clipboard-list" />
                Reglamento
              </NavLink>
            </div>
          </div>

          <div className="nav-item">
            <button type="button">
              Institución <i className="ti ti-chevron-down" style={{ fontSize: 12 }} />
            </button>
            <div className="dropdown">
              <NavLink to="/junta-directiva">
                <i className="ti ti-users" />
                Junta Directiva
              </NavLink>
              <NavLink to="/aliados-y-patrocinadores">
                <i className="ti ti-building-bank" />
                Aliados y Patrocinadores
              </NavLink>
            </div>
          </div>

          <div className="nav-item">
            <button type="button">
              El Parque <i className="ti ti-chevron-down" style={{ fontSize: 12 }} />
            </button>
            <div className="dropdown">
              <NavLink to="/instalaciones-y-servicios">
                <i className="ti ti-building" />
                Instalaciones y Servicios
              </NavLink>
              <NavLink to="/programas-y-proyectos">
                <i className="ti ti-plant-2" />
                Programas y Proyectos
              </NavLink>
              <NavLink to="/galeria">
                <i className="ti ti-photo" />
                Galería
              </NavLink>
              <NavLink to="/mapa">
                <i className="ti ti-map" />
                Mapa del Parque
              </NavLink>
            </div>
          </div>

          <div className="nav-item">
            <button type="button">
              Reserva <i className="ti ti-chevron-down" style={{ fontSize: 12 }} />
            </button>
            <div className="dropdown">
              <NavLink to="/actividades">
                <i className="ti ti-calendar-event" />
                Actividades
              </NavLink>
              <NavLink to="/reserva">
                <i className="ti ti-ticket" />
                Reservar un Espacio
              </NavLink>
            </div>
          </div>

          <div className="nav-item">
            <NavLink to="/transparencia">Transparencia</NavLink>
          </div>

          <div className="nav-item">
            <NavLink to="/blog">Blog</NavLink>
          </div>

          <div className="nav-item">
            <NavLink to="/apoyanos">Apóyanos</NavLink>
          </div>
        </div>

        <div className="nav-cta">
          <a href="mailto:asistentepcs@gmail.com">
            <i className="ti ti-mail" /> asistentepcs@gmail.com
          </a>
          <NavLink to="/contacto" className="btn-primary">
            <i className="ti ti-map-pin" /> Contáctanos
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
