import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { QrConfig } from './entityConfigs'

/**
 * Ventana con el código QR de una fila, para descargarlo o imprimirlo.
 *
 * El código lleva a una página del sitio, no contiene los datos. La razón es
 * que un QR impreso no se puede corregir: si llevara el número de cuenta y un
 * día se cambia, todos los carteles quedan mandando dinero a la cuenta vieja.
 * Apuntando a la página, lo que se corrija en el panel se ve al escanear.
 *
 * El dominio se toma de donde está corriendo el panel, que es el mismo del
 * sitio: no hace falta configurar nada y no puede apuntar a otro lado.
 */

interface Props {
  config: QrConfig
  row: Record<string, unknown>
  onClose: () => void
}

/** Tamaño del PNG que se descarga: sobra para un cartel tamaño carta. */
const PIXELES_DESCARGA = 1024

function nombreDeArchivo(titulo: string): string {
  return (
    titulo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'codigo-qr'
  )
}

export function QrModal({ config, row, onClose }: Props) {
  const enlace = `${window.location.origin}${config.ruta(row)}`
  const titulo = config.titulo(row)
  const detalle = config.detalle(row)

  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    // Nivel de corrección M: aguanta que el cartel se manche o se doble un
    // poco sin dejar de leerse, y no engorda tanto el código como el nivel H.
    QRCode.toString(enlace, { type: 'svg', errorCorrectionLevel: 'M', margin: 1 })
      .then((s) => {
        if (vigente) setSvg(s)
      })
      .catch((e: unknown) => {
        if (vigente) setError(e instanceof Error ? e.message : 'No se pudo generar el código')
      })
    return () => {
      vigente = false
    }
  }, [enlace])

  useEffect(() => {
    function alPulsar(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [onClose])

  // Mientras la ventana está abierta, imprimir saca solo el cartel. La clase
  // vive en <body> porque las reglas de impresión tienen que ocultar todo lo
  // que está fuera de esta ventana, y desde aquí no se llega a eso de otro modo.
  useEffect(() => {
    document.body.classList.add('imprime-qr')
    return () => document.body.classList.remove('imprime-qr')
  }, [])

  async function descargar() {
    const url = await QRCode.toDataURL(enlace, {
      width: PIXELES_DESCARGA,
      errorCorrectionLevel: 'M',
      margin: 2,
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${nombreDeArchivo(titulo)}.png`
    a.click()
  }

  return (
    <div
      className="modal-fondo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-caja qr-caja" role="dialog" aria-modal="true" aria-label={config.etiqueta}>
        <header className="modal-cabecera qr-no-imprimir">
          <div>
            <h2>{config.etiqueta}</h2>
            <p>{config.ayuda}</p>
          </div>
          <button type="button" className="modal-cerrar" onClick={onClose} aria-label="Cerrar">
            <i className="ti ti-x" />
          </button>
        </header>

        {/* Esto es lo que se imprime: el código, el título y los datos. */}
        <div className="qr-cartel">
          <h3 className="qr-titulo">{titulo}</h3>
          <p className="qr-instruccion">Escanea el código con la cámara de tu teléfono</p>

          {error ? (
            <p className="admin-error">{error}</p>
          ) : svg ? (
            <div className="qr-codigo" dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <div className="qr-codigo qr-cargando" aria-busy="true" />
          )}

          <dl className="qr-datos">
            {detalle.map((d) => (
              <div key={d.etiqueta}>
                <dt>{d.etiqueta}</dt>
                <dd>{d.valor}</dd>
              </div>
            ))}
          </dl>

          <p className="qr-enlace">{enlace}</p>
        </div>

        <footer className="qr-pie qr-no-imprimir">
          <button type="button" className="btn-outline" onClick={() => window.print()}>
            <i className="ti ti-printer" /> Imprimir
          </button>
          <button type="button" className="btn-primary" onClick={descargar} disabled={!svg}>
            <i className="ti ti-download" /> Descargar PNG
          </button>
        </footer>
      </div>
    </div>
  )
}
