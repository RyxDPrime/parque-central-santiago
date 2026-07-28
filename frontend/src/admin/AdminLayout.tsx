import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearToken, isLoggedIn } from './adminClient'
import { entityConfigs } from './entityConfigs'

export function AdminLayout() {
  const navigate = useNavigate()

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img src="/images/brand/logo-pcs-icon.png" alt="" />
          <span>Panel PCS</span>
        </div>
        <nav>
          {entityConfigs.map((entity) => (
            <NavLink key={entity.path} to={`/admin/${entity.path}`} className="admin-nav-link">
              {entity.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          <i className="ti ti-logout" /> Cerrar sesión
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
