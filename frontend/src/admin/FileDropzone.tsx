import { type DragEvent, useEffect, useRef, useState } from 'react'

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

  const isPdf = accept?.includes('pdf')

  // Las URLs temporales de la vista previa hay que liberarlas al reemplazarlas
  // o al desmontar, si no se acumulan en memoria.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function setFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    if (inputRef.current) {
      inputRef.current.files = files
    }
    setFileName(file.name)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    })
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
  )
}
