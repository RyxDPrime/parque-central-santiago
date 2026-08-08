import { type FormEvent, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { api } from '../api/client'

type SubmitStatus = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'error'; message: string }

export function Contacto() {
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setStatus({ kind: 'sending' })
    try {
      await api.enviarContacto({
        nombre: String(formData.get('nombre') ?? ''),
        email: String(formData.get('email') ?? ''),
        telefono: String(formData.get('telefono') ?? '') || undefined,
        asunto: String(formData.get('asunto') ?? '') || undefined,
        mensaje: String(formData.get('mensaje') ?? ''),
      })
      setStatus({ kind: 'success' })
      form.reset()
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Ocurrió un error inesperado',
      })
    }
  }

  return (
    <>
      <PageHero
        label="Contacto"
        title="Contacto y Ubicación"
        description="Escríbenos, visítanos o contáctanos por teléfono y WhatsApp."
        image="/images/galeria/gimnasio-aire-libre.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="contact-grid">
            <div className="contact-info-card">
              <h3>Información de contacto</h3>
              <div className="contact-info-list">
                <div className="contact-row">
                  <span className="contact-row-icon">
                    <i className="ti ti-map-pin" />
                  </span>
                  Av. Bartolomé Colón esq. Padre Las Casas, Santiago de los Caballeros
                </div>
                <a className="contact-row is-link" href="mailto:asistentepcs@gmail.com">
                  <span className="contact-row-icon">
                    <i className="ti ti-mail" />
                  </span>
                  asistentepcs@gmail.com
                </a>
                <a className="contact-row is-link" href="tel:+18095839581">
                  <span className="contact-row-icon">
                    <i className="ti ti-phone" />
                  </span>
                  (809) 583-9581
                </a>
                <a
                  className="contact-row is-link"
                  href="https://wa.me/18495807344"
                  target="_blank"
                  rel="noopener"
                >
                  <span className="contact-row-icon">
                    <i className="ti ti-brand-whatsapp" />
                  </span>
                  (849) 580-7344
                </a>
                <div className="contact-row">
                  <span className="contact-row-icon">
                    <i className="ti ti-clock" />
                  </span>
                  Parque: 5:30 a.m. – 9:00 p.m. · Oficina: lun–vie 8:30 a.m. – 5:00 p.m.
                </div>
              </div>
              <a
                href="https://www.google.com/maps/place/Parque+Central+de+Santiago/@19.4667053,-70.695271,17z"
                target="_blank"
                rel="noopener"
                className="btn-outline-white"
                style={{ marginTop: 8 }}
              >
                <i className="ti ti-map-2" /> Ver en Google Maps
              </a>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" type="text" required minLength={2} />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="form-row">
                <label htmlFor="telefono">Teléfono (opcional)</label>
                <input id="telefono" name="telefono" type="tel" />
              </div>
              <div className="form-row">
                <label htmlFor="asunto">Asunto (opcional)</label>
                <input id="asunto" name="asunto" type="text" />
              </div>
              <div className="form-row">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea id="mensaje" name="mensaje" required minLength={10} />
              </div>

              {status.kind === 'success' && (
                <p className="form-feedback success">
                  ¡Gracias! Tu mensaje fue enviado, te responderemos pronto.
                </p>
              )}
              {status.kind === 'error' && (
                <p className="form-feedback error">No se pudo enviar tu mensaje: {status.message}</p>
              )}

              <button type="submit" className="btn-primary" disabled={status.kind === 'sending'}>
                <i className="ti ti-send" />
                {status.kind === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
