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
}

export function FileDropzone({
  name,
  accept,
  required,
  currentFileLabel,
  currentFileUrl,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [porRecortar, setPorRecortar] = useState<File | null>(null)

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

  // Vista previa: la del archivo recién elegido, o la del que ya estaba guardado.
  const imagenPrevia = preview ?? (!isPdf ? currentFileUrl : null)

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
          {currentFileLabel && (
            <span className="file-dropzone-current">Archivo actual: {currentFileLabel}</span>
          )}
        </>
      )}
    </div>

    {porRecortar && (
      <ImageCropper
        file={porRecortar}
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
