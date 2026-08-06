import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'

interface ImageCropperProps {
  file: File
  /** Devuelve la imagen ya cuadrada; null si se cancela. */
  onConfirm: (recortada: File) => void
  onCancel: () => void
}

// Lado del área de vista previa y del archivo resultante.
const VISTA = 320
const SALIDA = 800

export function ImageCropper({ file, onConfirm, onCancel }: ImageCropperProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [procesando, setProcesando] = useState(false)
  const arrastre = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  // Escala mínima para que la imagen cubra el cuadro sin dejar bordes vacíos.
  const escalaBase = natural ? Math.max(VISTA / natural.w, VISTA / natural.h) : 1
  const escala = escalaBase * zoom
  const anchoMostrado = natural ? natural.w * escala : 0
  const altoMostrado = natural ? natural.h * escala : 0

  function limitar(x: number, y: number) {
    const maxX = Math.max(0, (anchoMostrado - VISTA) / 2)
    const maxY = Math.max(0, (altoMostrado - VISTA) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }

  // Al cambiar el zoom hay que reajustar, si no la imagen deja huecos.
  useEffect(() => {
    setPos((p) => limitar(p.x, p.y))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, natural])

  function alPresionar(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastre.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y }
  }

  function alMover(e: ReactPointerEvent<HTMLDivElement>) {
    if (!arrastre.current) return
    const d = arrastre.current
    setPos(limitar(d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y)))
  }

  function alSoltar() {
    arrastre.current = null
  }

  function exportar(canvas: HTMLCanvasElement) {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setProcesando(false)
          return
        }
        const nombre = file.name.replace(/\.[^.]+$/, '') + '.jpg'
        onConfirm(new File([blob], nombre, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      0.92,
    )
  }

  function dibujar(modo: 'recorte' | 'entera') {
    if (!natural || !url) return
    setProcesando(true)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = SALIDA
      canvas.height = SALIDA
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setProcesando(false)
        return
      }

      // Fondo blanco: el JPEG no tiene transparencia y la foto entera deja franjas.
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, SALIDA, SALIDA)

      if (modo === 'entera') {
        const f = Math.min(SALIDA / natural.w, SALIDA / natural.h)
        const dw = natural.w * f
        const dh = natural.h * f
        ctx.drawImage(img, (SALIDA - dw) / 2, (SALIDA - dh) / 2, dw, dh)
      } else {
        // Se traduce lo que se ve en el cuadro a coordenadas de la imagen original.
        const ladoOrigen = VISTA / escala
        const sx = natural.w / 2 - pos.x / escala - ladoOrigen / 2
        const sy = natural.h / 2 - pos.y / escala - ladoOrigen / 2
        ctx.drawImage(img, sx, sy, ladoOrigen, ladoOrigen, 0, 0, SALIDA, SALIDA)
      }

      exportar(canvas)
    }
    img.onerror = () => setProcesando(false)
    img.src = url
  }

  return (
    <div className="cropper-overlay" role="dialog" aria-modal="true" aria-label="Ajustar imagen">
      <div className="cropper-card" onClick={(e) => e.stopPropagation()}>
        <h3>Ajusta la imagen</h3>
        <p className="cropper-sub">
          Arrastra la foto y usa el control para acercarla. Lo que quede dentro del cuadro es lo
          que se verá en la página.
        </p>

        <div
          className="cropper-vista"
          style={{ width: VISTA, height: VISTA }}
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
        >
          {url && (
            <img
              src={url}
              alt=""
              draggable={false}
              onLoad={(e) =>
                setNatural({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                })
              }
              style={{
                width: anchoMostrado || undefined,
                height: altoMostrado || undefined,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            />
          )}
          <span className="cropper-marco" />
        </div>

        <label className="cropper-zoom">
          <i className="ti ti-zoom-in" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>

        <div className="cropper-acciones">
          <button
            type="button"
            className="btn-primary"
            disabled={!natural || procesando}
            onClick={() => dibujar('recorte')}
          >
            <i className="ti ti-crop" /> Usar este recorte
          </button>
          <button
            type="button"
            className="btn-outline"
            disabled={!natural || procesando}
            onClick={() => dibujar('entera')}
          >
            <i className="ti ti-photo" /> Usar la foto entera
          </button>
          <button type="button" className="cropper-cancelar" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
