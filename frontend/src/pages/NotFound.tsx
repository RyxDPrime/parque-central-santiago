import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'

const atajos = [
  { to: '/', icon: 'ti-home', label: 'Inicio' },
  { to: '/instalaciones-y-servicios', icon: 'ti-building', label: 'Instalaciones y Servicios' },
  { to: '/actividades', icon: 'ti-calendar-event', label: 'Actividades' },
  { to: '/contacto', icon: 'ti-mail', label: 'Contacto' },
]

export function NotFound() {
  return (
    <>
      <PageHero
        label="Error 404"
        title="No encontramos esta página"
        description="Es posible que el enlace esté roto o que la página se haya movido."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="notfound-box">
            <i className="ti ti-map-search" />
            <h2>¿Buscabas algo en particular?</h2>
            <p>
              Revisa la dirección o entra por alguna de estas secciones. Si crees que se trata de un
              error, escríbenos y lo revisamos.
            </p>
            <div className="notfound-links">
              {atajos.map((a) => (
                <Link to={a.to} key={a.to} className="notfound-link">
                  <i className={`ti ${a.icon}`} />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
