import type { ReglaUso } from '../api/client'

/**
 * Las reglas de uso, agrupadas por apartado.
 *
 * Se usa en dos sitios con la misma pinta: dentro del formulario de Reserva,
 * con solo las reglas de lo que la persona eligió, y en la página de
 * Condiciones de uso, con todas.
 *
 * Cada regla se marca según lo que sea. La distinción no es decorativa: leer
 * veinte líneas iguales no deja ver cuál es la que prohíbe algo, y esa es
 * justamente la que se le reclama a alguien después.
 */

const MARCA: Record<string, { icono: string; clase: string; etiqueta: string }> = {
  permitido: { icono: 'ti-check', clase: 'es-permitido', etiqueta: 'Permitido' },
  prohibido: { icono: 'ti-ban', clase: 'es-prohibido', etiqueta: 'No permitido' },
  requisito: { icono: 'ti-point-filled', clase: 'es-requisito', etiqueta: 'Requisito' },
}

/** Junta las reglas por su apartado, conservando el orden en que llegaron. */
export function porGrupo(reglas: ReglaUso[]): [string, ReglaUso[]][] {
  const grupos = new Map<string, ReglaUso[]>()
  for (const regla of reglas) {
    const lista = grupos.get(regla.grupo)
    if (lista) lista.push(regla)
    else grupos.set(regla.grupo, [regla])
  }
  return [...grupos]
}

export function ListaDeReglas({ reglas, compacta }: { reglas: ReglaUso[]; compacta?: boolean }) {
  if (reglas.length === 0) return null

  return (
    <div className={`reglas${compacta ? ' es-compacta' : ''}`}>
      {porGrupo(reglas).map(([grupo, delGrupo]) => (
        <section key={grupo} className="reglas-grupo">
          <h3>{grupo}</h3>
          <ul>
            {delGrupo.map((regla) => {
              const marca = MARCA[regla.tipo] ?? MARCA.requisito
              return (
                <li key={regla.id} className={marca.clase}>
                  <i className={`ti ${marca.icono}`} aria-hidden="true" />
                  <span>
                    <span className="sr-only">{marca.etiqueta}: </span>
                    {regla.texto}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

/**
 * Las reglas que aplican a lo que alguien eligió: las generales quedan fuera
 * —viven en la página de Condiciones— y se devuelven solo las del trámite y las
 * del espacio, que son las que cambian según lo que se pida.
 */
export function reglasDeLoElegido(
  reglas: ReglaUso[] | null,
  tipoActividad: string,
  espacio: string,
): ReglaUso[] {
  if (!reglas) return []
  return reglas.filter(
    (r) =>
      (r.ambito === 'tramite' && r.aplicaA === tipoActividad) ||
      (r.ambito === 'espacio' && r.aplicaA === espacio),
  )
}
