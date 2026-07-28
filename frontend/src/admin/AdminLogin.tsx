import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <img src="/images/brand/logo-pcs.png" alt="Parque Central de Santiago" className="admin-login-logo" />
        <h1>Panel de administración</h1>
        <div className="form-row">
          <label htmlFor="username">Usuario</label>
          <input id="username" name="username" type="text" required autoFocus />
        </div>
        <div className="form-row">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" required />
        </div>
        {error && <p className="form-feedback error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
