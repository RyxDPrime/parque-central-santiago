import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/**
 * Ventana de confirmación propia del panel, en lugar del `window.confirm` del
 * navegador.
 *
 * La del navegador funciona, pero no es del sitio: sale con la tipografía y
 * los colores del sistema, no distingue una acción destructiva de una
 * corriente, y en algunos navegadores el usuario puede pedir que no vuelva a
 * mostrarse, con lo que un "eliminar" deja de preguntar sin que nadie lo
 * decida. Esta se ve como el resto del panel y la pregunta siempre.
 *
 * Se usa igual que la del navegador, salvo que es asíncrona:
 *
 *   const confirmar = useConfirmar()
 *   if (!(await confirmar({ titulo: '¿Eliminar este registro?', peligrosa: true }))) return
 *
 * El proveedor va en AdminLayout, así que cualquier pantalla del panel puede
 * pedirla sin montar nada.
 */

export interface OpcionesConfirmar {
  /** La pregunta, en forma de título. */
  titulo: string
  /** Detalle debajo del título. Los saltos de línea se respetan. */
  mensaje?: string
  /** Texto del botón que confirma. Por omisión, "Confirmar". */
  confirmar?: string
  /** Texto del botón que cancela. Por omisión, "Cancelar". */
  cancelar?: string
  /**
   * Marca la acción como destructiva: el botón de confirmar se pinta en rojo
   * y el foco inicial va a "Cancelar", para que un Enter por inercia no borre
   * nada.
   */
  peligrosa?: boolean
}

type Pedir = (opciones: OpcionesConfirmar) => Promise<boolean>

const Contexto = createContext<Pedir | null>(null)

export function useConfirmar(): Pedir {
  const pedir = useContext(Contexto)
  if (!pedir) {
    throw new Error('useConfirmar necesita un <ProveedorConfirmar> por encima (está en AdminLayout).')
  }
  return pedir
}

interface Pendiente {
  opciones: OpcionesConfirmar
  resolver: (respuesta: boolean) => void
}

export function ProveedorConfirmar({ children }: { children: ReactNode }) {
  const [pendiente, setPendiente] = useState<Pendiente | null>(null)

  const pedir = useCallback<Pedir>(
    (opciones) =>
      new Promise<boolean>((resolver) => {
        setPendiente({ opciones, resolver })
      }),
    [],
  )

  function responder(respuesta: boolean) {
    pendiente?.resolver(respuesta)
    setPendiente(null)
  }

  return (
    <Contexto.Provider value={pedir}>
      {children}
      {pendiente && <Ventana opciones={pendiente.opciones} onResponder={responder} />}
    </Contexto.Provider>
  )
}

function Ventana({
  opciones,
  onResponder,
}: {
  opciones: OpcionesConfirmar
  onResponder: (respuesta: boolean) => void
}) {
  const { titulo, mensaje, confirmar = 'Confirmar', cancelar = 'Cancelar', peligrosa = false } = opciones
  const botonInicial = useRef<HTMLButtonElement>(null)

  // El foco entra en la ventana al abrirse: sin esto, Tab sigue recorriendo
  // la pantalla de atrás y el teclado no llega a los botones.
  useEffect(() => {
    botonInicial.current?.focus()
  }, [])

  useEffect(() => {
    function alPulsar(e: KeyboardEvent) {
      if (e.key === 'Escape') onResponder(false)
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [onResponder])

  const botonCancelar = (
    <button
      type="button"
      className="btn-outline"
      ref={peligrosa ? botonInicial : undefined}
      onClick={() => onResponder(false)}
    >
      {cancelar}
    </button>
  )
  const botonConfirmar = (
    <button
      type="button"
      className={peligrosa ? 'btn-peligro' : 'btn-primary'}
      ref={peligrosa ? undefined : botonInicial}
      onClick={() => onResponder(true)}
    >
      {confirmar}
    </button>
  )

  return (
    <div
      className="modal-fondo confirmar-fondo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onResponder(false)
      }}
    >
      <div
        className="modal-caja confirmar-caja"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmar-titulo"
        aria-describedby={mensaje ? 'confirmar-mensaje' : undefined}
      >
        <div className="confirmar-cuerpo">
          <span className={`confirmar-icono${peligrosa ? ' es-peligro' : ''}`} aria-hidden="true">
            <i className={`ti ${peligrosa ? 'ti-alert-triangle' : 'ti-help-circle'}`} />
          </span>
          <h2 id="confirmar-titulo">{titulo}</h2>
          {mensaje && (
            <p id="confirmar-mensaje" className="confirmar-mensaje">
              {mensaje}
            </p>
          )}
        </div>
        <div className="confirmar-pie">
          {botonCancelar}
          {botonConfirmar}
        </div>
      </div>
    </div>
  )
}
