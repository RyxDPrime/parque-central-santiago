import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const menuGroups = [
  {
    label: 'Sobre Nosotros',
    items: [
      { to: '/sobre-el-parque', icon: 'ti-book', label: 'Historia' },
      { to: '/reglamento', icon: 'ti-clipboard-list', label: 'Reglamento' },
    ],
  },
  {
    label: 'Institución',
    items: [
      { to: '/junta-directiva', icon: 'ti-users', label: 'Junta Directiva' },
      { to: '/personal-tecnico', icon: 'ti-briefcase', label: 'Personal Técnico' },
    ],
  },
  {
    label: 'El Parque',
    items: [
      { to: '/instalaciones-y-servicios', icon: 'ti-building', label: 'Instalaciones y Servicios' },
      { to: '/programas-y-proyectos', icon: 'ti-plant-2', label: 'Programas y Proyectos' },
      { to: '/mision-vision-valores', icon: 'ti-target-arrow', label: 'Misión, Visión y Valores' },
      { to: '/galeria', icon: 'ti-photo', label: 'Galería' },
      { to: '/mapa', icon: 'ti-map', label: 'Mapa del Parque' },
    ],
  },
  {
    label: 'Reserva',
    items: [
      { to: '/actividades', icon: 'ti-calendar-event', label: 'Actividades' },
      { to: '/reserva', icon: 'ti-ticket', label: 'Reservar un Espacio' },
    ],
  },
]

const soloLinks = [
  { to: '/transparencia', icon: 'ti-file-invoice', label: 'Transparencia' },
  { to: '/blog', icon: 'ti-article', label: 'Blog' },
  { to: '/apoyanos', icon: 'ti-heart-handshake', label: 'Apóyanos' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Al navegar se cierra el menú para que no tape la página nueva.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Evita que el fondo se desplace mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // El cajón tapa la página entera, así que se cierra con Escape.
  useEffect(() => {
    if (!open) return
    function alPulsar(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [open])

  return (
    <nav id="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          <img
            src="/images/brand/logo-pcs.png"
            alt="Parque Central de Santiago"
            className="brand-logo"
          />
        </NavLink>

        <div className="nav-links">
          <div className="nav-item">
            <NavLink to="/" end>
              Inicio
            </NavLink>
          </div>

          {menuGroups.map((group) => (
            <div className="nav-item" key={group.label}>
              <button type="button">
                {group.label} <i className="ti ti-chevron-down" style={{ fontSize: 12 }} />
              </button>
              <div className="dropdown">
                {group.items.map((item) => (
                  <NavLink to={item.to} key={item.to}>
                    <i className={`ti ${item.icon}`} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {soloLinks.map((item) => (
            <div className="nav-item" key={item.to}>
              <NavLink to={item.to}>{item.label}</NavLink>
            </div>
          ))}
        </div>

        <div className="nav-cta">
          <a href="mailto:asistentepcs@gmail.com">
            <i className="ti ti-mail" /> asistentepcs@gmail.com
          </a>
          <NavLink to="/contacto" className="btn-primary">
            <i className="ti ti-map-pin" /> Contáctanos
          </NavLink>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i className={`ti ${open ? 'ti-x' : 'ti-menu-2'}`} />
        </button>
      </div>

      {open && (
        <>
        {/* Cubre la página mientras el cajón está abierto: se cierra al tocarlo. */}
        <div className="mobile-menu-fondo" onClick={() => setOpen(false)} />

        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="mobile-menu-cabeza">
            <img
              src="/images/brand/logo-pcs.png"
              alt="Parque Central de Santiago"
              className="mobile-menu-logo"
            />
            <button
              type="button"
              className="mobile-menu-cerrar"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          <NavLink to="/" end className="mobile-menu-link">
            <i className="ti ti-home" />
            Inicio
          </NavLink>

          {menuGroups.map((group) => (
            <div className="mobile-menu-group" key={group.label}>
              <p className="mobile-menu-title">{group.label}</p>
              {group.items.map((item) => (
                <NavLink to={item.to} key={item.to} className="mobile-menu-link">
                  <i className={`ti ${item.icon}`} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="mobile-menu-group">
            {soloLinks.map((item) => (
              <NavLink to={item.to} key={item.to} className="mobile-menu-link">
                <i className={`ti ${item.icon}`} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mobile-menu-footer">
            <NavLink to="/contacto" className="btn-primary">
              <i className="ti ti-map-pin" /> Contáctanos
            </NavLink>
            <a href="mailto:asistentepcs@gmail.com" className="mobile-menu-mail">
              <i className="ti ti-mail" /> asistentepcs@gmail.com
            </a>
          </div>
        </div>
        </>
      )}
    </nav>
  )
}
