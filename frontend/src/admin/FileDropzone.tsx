import { type DragEvent, useEffect, useRef, useState } from 'react'
import { ImageCropper } from './ImageCropper'

interface FileDropzoneProps {
  name: string
  accept?: string
  required?: boolean
  /** Nombre del archivo ya guardado, al editar un registro existente. */
  currentFileLabel?: string | null
  /** URL del archivo ya guardado, para mostrarlo como vista previa. */
  currentFileUrl?: string | null
  /** Proporción con la que se mostrará la imagen en el sitio. */
  aspect?: number
  /** Permite dejar el registro sin foto, no solo reemplazarla. */
  permiteQuitar?: boolean
}

export function FileDropzone({
  name,
  accept,
  required,
  currentFileLabel,
  currentFileUrl,
  aspect,
  permiteQuitar,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [porRecortar, setPorRecortar] = useState<File | null>(null)
  // Marcado para borrar la foto que ya estaba guardada. Se envía como un campo
  // más del formulario, porque "no elegí archivo" y "quiero quedarme sin foto"
  // llegarían iguales al guardar si no se distinguen.
  const [quitarGuardada, setQuitarGuardada] = useState(false)

  const isPdf = accept?.includes('pdf')

  // Las URLs temporales de la vista previa hay que liberarlas al reemplazarlas
  // o al desmontar, si no se acumulan en memoria.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  /** Deja el archivo listo en el input y actualiza la vista previa. */
  function aplicarArchivo(file: File) {
    const dt = new DataTransfer()
    dt.items.add(file)
    if (inputRef.current) {
      inputRef.current.files = dt.files
    }
    setFileName(file.name)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    })
  }

  function setFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    // Las imágenes pasan primero por el recorte para elegir qué parte se ve.
    if (file.type.startsWith('image/')) {
      setPorRecortar(file)
      return
    }
    aplicarArchivo(file)
  }

  function limpiar(event: React.MouseEvent) {
    event.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    setFileName(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    setFiles(event.dataTransfer.files)
  }

  // Vista previa: la del archivo recién elegido, o la del que ya estaba
  // guardado, salvo que se haya marcado quitarlo.
  const guardadaVisible = quitarGuardada ? null : currentFileUrl
  const imagenPrevia = preview ?? (!isPdf ? guardadaVisible : null)
  const puedeQuitar = permiteQuitar && Boolean(currentFileUrl) && !fileName

  return (
    <>
    <div
      className={`file-dropzone${dragOver ? ' drag-over' : ''}${fileName ? ' has-file' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required && !currentFileLabel}
        onChange={(e) => setFiles(e.target.files)}
        hidden
      />

      {/* Solo viaja en el formulario cuando está marcado, y eso es lo que le
          dice al panel que guarde el registro sin foto. */}
      {quitarGuardada && <input type="hidden" name={`${name}__quitar`} value="1" />}

      {imagenPrevia ? (
        <img className="file-dropzone-preview" src={imagenPrevia} alt="Vista previa" />
      ) : (
        <i className={`ti ${isPdf ? 'ti-file-type-pdf' : 'ti-photo'}`} />
      )}

      {fileName ? (
        <>
          <span className="file-dropzone-name">{fileName}</span>
          <button type="button" className="file-dropzone-clear" onClick={limpiar}>
            <i className="ti ti-x" /> Quitar
          </button>
        </>
      ) : (
        <>
          <span className="file-dropzone-label">
            Arrastra {isPdf ? 'un PDF' : 'una foto'} aquí, o haz clic para elegirlo
          </span>
          {currentFileLabel && !quitarGuardada && (
            <span className="file-dropzone-current">Archivo actual: {currentFileLabel}</span>
          )}
          {quitarGuardada && (
            <span className="file-dropzone-current">Se guardará sin foto</span>
          )}

          {puedeQuitar && (
            <button
              type="button"
              className="file-dropzone-clear"
              onClick={(event) => {
                event.stopPropagation()
                setQuitarGuardada((v) => !v)
              }}
            >
              <i className={`ti ${quitarGuardada ? 'ti-arrow-back-up' : 'ti-photo-off'} `} />
              {quitarGuardada ? ' Conservar la foto actual' : ' Dejar sin foto'}
            </button>
          )}
        </>
      )}
    </div>

    {porRecortar && (
      <ImageCropper
        file={porRecortar}
        aspect={aspect}
        onConfirm={(recortada) => {
          aplicarArchivo(recortada)
          setPorRecortar(null)
        }}
        onCancel={() => {
          // Se descarta la selección para no dejar en el input un archivo
          // que el administrador no llegó a confirmar.
          if (inputRef.current) inputRef.current.value = ''
          setPorRecortar(null)
        }}
      />
    )}
    </>
  )
}
