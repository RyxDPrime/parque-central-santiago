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
              Sobre el Parque <i className="ti ti-chevron-down" style={{ fontSize: 12 }} />
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
              <NavLink to="/junta-directiva">
                <i className="ti ti-users" />
                Junta Directiva
              </NavLink>
              <NavLink to="/actividades">
                <i className="ti ti-calendar-event" />
                Actividades
              </NavLink>
              <NavLink to="/galeria">
                <i className="ti ti-photo" />
                Galería
              </NavLink>
            </div>
          </div>

          <div className="nav-item">
            <NavLink to="/aliados-y-patrocinadores">Aliados</NavLink>
          </div>

          <div className="nav-item">
            <NavLink to="/transparencia">Transparencia</NavLink>
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
