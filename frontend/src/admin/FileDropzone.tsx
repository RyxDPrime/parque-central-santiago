import { type DragEvent, useRef, useState } from 'react'

interface FileDropzoneProps {
  name: string
  accept?: string
  required?: boolean
  currentFileLabel?: string | null
}

export function FileDropzone({ name, accept, required, currentFileLabel }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function setFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (inputRef.current) {
      inputRef.current.files = files
    }
    setFileName(files[0].name)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    setFiles(event.dataTransfer.files)
  }

  const isPdf = accept?.includes('pdf')

  return (
    <div
      className={`file-dropzone${dragOver ? ' drag-over' : ''}`}
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
      <i className={`ti ${isPdf ? 'ti-file-type-pdf' : 'ti-photo'}`} />
      {fileName ? (
        <span className="file-dropzone-name">{fileName}</span>
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
