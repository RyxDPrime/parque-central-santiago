import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from './adminClient'

export function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setLoading(true)
    setError(null)
    try {
      await login(String(form.get('username')), String(form.get('password')))
      navigate('/admin/junta-directiva')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <img
          src="/images/brand/logo-pcs.png"
          alt="Parque Central de Santiago"
          className="admin-login-logo"
        />
        <h1>Panel de administración</h1>
        <p className="admin-login-sub">
          Acceso exclusivo del equipo del Parque Central de Santiago.
        </p>

        <div className="admin-field">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Tu nombre de usuario"
            autoComplete="username"
            required
            autoFocus
          />
        </div>

        <div className="admin-field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="form-feedback error">
            <i className="ti ti-alert-circle" /> {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          <i className="ti ti-login-2" />
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <Link to="/" className="admin-login-back">
          <i className="ti ti-arrow-left" /> Volver al sitio
        </Link>
      </form>
    </div>
  )
}
