import { Link } from 'react-router-dom'
import { useTextos, soloDigitos } from '../hooks/useTextos'

export function Footer() {
  const texto = useTextos()
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  background: 'var(--green-50)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}
              >
                <img
                  src="/images/brand/logo-pcs-icon.png"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--green-50)', fontSize: 15 }}>
                Parque Central de Santiago
              </span>
            </div>
            <p>
              El pulmón verde de Santiago de los Caballeros, al servicio de la recreación, el
              deporte y la comunidad desde 2018.
            </p>
            <div className="footer-social">
              <a
                href="https://www.instagram.com/parquecentralsantiago/"
                target="_blank"
                rel="noopener"
                className="social-btn"
                aria-label="Instagram"
              >
                <i className="ti ti-brand-instagram" />
              </a>
              <a
                href="https://www.facebook.com/Parquecentralstgo/"
                target="_blank"
                rel="noopener"
                className="social-btn"
                aria-label="Facebook"
              >
                <i className="ti ti-brand-facebook" />
              </a>
              <a
                href="https://x.com/PCentralSti"
                target="_blank"
                rel="noopener"
                className="social-btn"
                aria-label="X/Twitter"
              >
                <i className="ti ti-brand-x" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Sobre Nosotros</h4>
            <Link to="/sobre-el-parque">Historia</Link>
            <Link to="/reglamento">Reglamento</Link>
          </div>

          <div className="footer-col">
            <h4>Institución</h4>
            <Link to="/junta-directiva">Junta Directiva</Link>
            <Link to="/personal-tecnico">Personal Técnico</Link>
            <Link to="/transparencia">Transparencia</Link>
          </div>

          <div className="footer-col">
            <h4>El Parque</h4>
            <Link to="/instalaciones-y-servicios">Instalaciones y Servicios</Link>
            <Link to="/programas-y-proyectos">Programas y Proyectos</Link>
            <Link to="/galeria">Galería</Link>
            <Link to="/mapa">Mapa del Parque</Link>
            <Link to="/actividades">Actividades</Link>
            <Link to="/reserva">Reserva</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/apoyanos">Apóyanos</Link>
          </div>

          <div className="footer-col">
            <h4>Contacto</h4>
            <div className="contact-row">
              <i className="ti ti-map-pin" /> {texto('contacto.direccion')}
            </div>
            <a className="contact-row is-link" href={`mailto:${texto('contacto.email')}`}>
              <i className="ti ti-mail" /> {texto('contacto.email')}
            </a>
            <a className="contact-row is-link" href={`tel:+1${soloDigitos(texto('contacto.telefono'))}`}>
              <i className="ti ti-phone" /> {texto('contacto.telefono')}
            </a>
            <a
              className="contact-row is-link"
              href={`https://wa.me/1${soloDigitos(texto('contacto.whatsapp'))}`}
              target="_blank"
              rel="noopener"
            >
              <i className="ti ti-brand-whatsapp" /> {texto('contacto.whatsapp')}
            </a>
            <h4 style={{ marginTop: 16 }}>Horario</h4>
            <div className="contact-row">
              <i className="ti ti-clock" /> Parque: {texto('contacto.horarioParque')}
            </div>
            <div className="contact-row">
              <i className="ti ti-clock" /> Oficina: {texto('contacto.horarioOficina')}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Parque Central de Santiago. Todos los derechos reservados.</span>
          <div className="footer-bottom-links">
            <Link to="/transparencia">Transparencia</Link>
            <Link to="/contacto">Contacto</Link>
            <Link to="/admin/login">Acceso administrativo</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
