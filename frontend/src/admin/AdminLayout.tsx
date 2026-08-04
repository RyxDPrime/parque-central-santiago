import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken, isLoggedIn } from './adminClient'
import { entityConfigs } from './entityConfigs'

export function AdminLayout() {
  const navigate = useNavigate()

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar-brand" title="Volver a la página pública">
          <img src="/images/brand/logo-pcs-icon.png" alt="" />
          <span>
            Panel PCS
            <small>Parque Central de Santiago</small>
          </span>
        </Link>

        <nav>
          <p className="admin-nav-title">Contenido del sitio</p>
          {entityConfigs.map((entity) => (
            <NavLink key={entity.path} to={`/admin/${entity.path}`} className="admin-nav-link">
              <i className={`ti ${entity.icon}`} />
              {entity.label}
            </NavLink>
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
