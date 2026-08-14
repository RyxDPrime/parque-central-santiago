import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, isLoggedIn } from './adminClient'
import { entityConfigs, fotoSecciones, textoSecciones } from './entityConfigs'

/**
 * Divisiones del menú lateral, en el orden en que se muestran.
 *
 * Aquí vive solo el *orden y el agrupamiento* del menú; qué campos tiene cada
 * sección sigue definido en `entityConfigs`. Las secciones se listan siguiendo
 * el mismo recorrido que el menú del sitio público, para que el administrador
 * las busque donde ya sabe que están.
 *
 * Las rutas que empiezan con `textos/` son grupos de textos sueltos; el resto
 * son secciones con tabla.
 */
const divisiones = [
  {
    titulo: 'Página de inicio',
    rutas: ['textos/inicio', 'textos/titulos-inicio', 'cifras', 'foto/inicio-quienes'],
  },
  {
    titulo: 'Secciones del sitio',
    rutas: [
      'hitos',
      'aliados',
      'normas',
      'junta-directiva',
      'personal-tecnico',
      'instalaciones',
      'programas',
      'galeria',
      'puntos-mapa',
      'actividades',
      'pasos-reserva',
      'documentos-financieros',
      'publicaciones',
      'formas-apoyo',
    ],
  },
  {
    titulo: 'Todo el sitio',
    rutas: ['textos/contacto', 'encabezados'],
  },
]

interface Enlace {
  ruta: string
  label: string
  icon: string
}

/**
 * Secciones agrupadas. Lo que no esté nombrado arriba no se pierde: se añade al
 * final de "Todo el sitio", para que una sección nueva no quede fuera del menú.
 */
function agrupar(): { titulo: string; enlaces: Enlace[] }[] {
  const buscar = (ruta: string): Enlace | undefined => {
    const texto = textoSecciones.find((t) => `textos/${t.slug}` === ruta)
    if (texto) return { ruta, label: texto.label, icon: texto.icon }
    const foto = fotoSecciones.find((f) => `foto/${f.clave}` === ruta)
    if (foto) return { ruta, label: foto.label, icon: foto.icon }
    const entidad = entityConfigs.find((e) => e.path === ruta)
    return entidad && { ruta, label: entidad.label, icon: entidad.icon }
  }

  const nombradas = new Set(divisiones.flatMap((d) => d.rutas))
  const grupos = divisiones.map((division) => ({
    titulo: division.titulo,
    enlaces: division.rutas.map(buscar).filter((e) => e !== undefined),
  }))

  // Las secciones con tabla que nadie ubicó. Los grupos de texto no hace falta
  // recogerlos así: los que pertenecen a una sección se editan dentro de ella.
  const sueltas = entityConfigs
    .filter((e) => !nombradas.has(e.path))
    .map((e) => ({ ruta: e.path, label: e.label, icon: e.icon }))
  grupos[grupos.length - 1].enlaces.push(...sueltas)

  return grupos.filter((grupo) => grupo.enlaces.length > 0)
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  // En móvil la columna de secciones es un cajón: ocupa toda la pantalla y se
  // abre desde la barra superior, en vez de quedar apilada encima del contenido.
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Al entrar a una sección el cajón sobra: tapa justo lo que se fue a ver.
  useEffect(() => {
    setMenuAbierto(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAbierto])

  useEffect(() => {
    if (!menuAbierto) return
    function alPulsar(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [menuAbierto])

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  return (
    <div className="admin-shell">
      {/* Solo se ve en móvil: en pantalla grande la columna está siempre fija. */}
      <header className="admin-barra">
        <button
          type="button"
          className="admin-barra-menu"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú de secciones"
          aria-expanded={menuAbierto}
        >
          <i className="ti ti-menu-2" />
        </button>
        <span>Panel PCS</span>
      </header>

      {menuAbierto && (
        <div className="admin-sidebar-fondo" onClick={() => setMenuAbierto(false)} />
      )}

      <aside className={`admin-sidebar${menuAbierto ? ' esta-abierto' : ''}`}>
        <button
          type="button"
          className="admin-sidebar-cerrar"
          onClick={() => setMenuAbierto(false)}
          aria-label="Cerrar menú"
        >
          <i className="ti ti-x" />
        </button>

        <Link to="/" className="admin-sidebar-brand" title="Volver a la página pública">
          <img src="/images/brand/logo-pcs-icon.png" alt="" />
          <span>
            Panel PCS
            <small>Parque Central de Santiago</small>
          </span>
        </Link>

        <nav>
          {agrupar().map((grupo, i) => (
            <div key={grupo.titulo}>
              <p className="admin-nav-title" style={i > 0 ? { marginTop: 16 } : undefined}>
                {grupo.titulo}
              </p>
              {grupo.enlaces.map((enlace) => (
                <NavLink key={enlace.ruta} to={`/admin/${enlace.ruta}`} className="admin-nav-link">
                  <i className={`ti ${enlace.icon}`} />
                  {enlace.label}
                </NavLink>
              ))}
            </div>
          ))}

          <p className="admin-nav-title" style={{ marginTop: 16 }}>
            Buzón
          </p>
          <NavLink to="/admin/mensajes" className="admin-nav-link">
            <i className="ti ti-mail" />
            Mensajes de contacto
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-link">
            <i className="ti ti-external-link" /> Ver el sitio público
          </Link>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <i className="ti ti-logout" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
