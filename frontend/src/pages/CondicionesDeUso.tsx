import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'
import { ListaDeReglas } from '../components/ListaDeReglas'

/**
 * Las condiciones de uso de los espacios del Parque, completas.
 *
 * Existe porque el formulario de Reserva no puede cargarlas: son sesenta
 * reglas, y ponerlas encima de los campos garantiza que nadie las lea. Allí se
 * muestran solo las del espacio y el trámite que la persona eligió; aquí están
 * todas, para leerlas antes de solicitar o para consultarlas después.
 *
 * Salen de la base, como el resto del contenido: el Parque las cambia desde el
 * panel sin pedirnos nada.
 */
export function CondicionesDeUso() {
  const { data: reglas, loading, error } = useApiData(api.getReglasUso)

  const generales = (reglas ?? []).filter((r) => r.ambito === 'general')
  const porTramite = (reglas ?? []).filter((r) => r.ambito === 'tramite')
  const porEspacio = (reglas ?? []).filter((r) => r.ambito === 'espacio')

  // Los nombres de trámite y espacio, en el orden en que aparecen: así los
  // apartados salen agrupados por aquello a lo que aplican, y no revueltos.
  const nombresDe = (lista: typeof porTramite) => [...new Set(lista.map((r) => r.aplicaA ?? ''))]

  return (
    <>
      <PageHero
        pagina="condiciones-de-uso"
        label="Reserva de espacios"
        title="Condiciones de uso"
        description="Lo que hay que saber antes de solicitar un espacio del Parque: responsabilidades, montaje, permisos y las reglas propias de cada actividad."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner condiciones">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {reglas && (
            <>
              <p className="condiciones-intro">
                El uso de los espacios está sujeto a la evaluación y autorización previa de la
                Administración. Recibir una solicitud no es aprobarla: la respuesta llega por
                correo, y puede tomar entre uno y tres días laborables.{' '}
                <Link to="/reserva">Ir al formulario de solicitud</Link>.
              </p>

              <ListaDeReglas reglas={generales} />

              {porTramite.length > 0 && (
                <>
                  <h2 className="condiciones-titulo">Según la actividad</h2>
                  <p className="condiciones-sub">
                    Además de lo anterior, cada tipo de actividad tiene sus propias reglas.
                  </p>
                  {nombresDe(porTramite).map((nombre) => (
                    <div key={nombre} className="condiciones-bloque">
                      <h3 className="condiciones-para">{nombre}</h3>
                      <ListaDeReglas
                        reglas={porTramite.filter((r) => r.aplicaA === nombre)}
                        compacta
                      />
                    </div>
                  ))}
                </>
              )}

              {porEspacio.length > 0 && (
                <>
                  <h2 className="condiciones-titulo">Según el espacio</h2>
                  <p className="condiciones-sub">
                    Algunos espacios tienen condiciones que no aplican a los demás.
                  </p>
                  {nombresDe(porEspacio).map((nombre) => (
                    <div key={nombre} className="condiciones-bloque">
                      <h3 className="condiciones-para">{nombre}</h3>
                      <ListaDeReglas
                        reglas={porEspacio.filter((r) => r.aplicaA === nombre)}
                        compacta
                      />
                    </div>
                  ))}
                </>
              )}

              <p className="condiciones-cierre">
                El Parque se reserva el derecho de establecer condiciones adicionales según las
                características de cada actividad. Para consultas:{' '}
                <Link to="/contacto">Contacto</Link>.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  )
}
