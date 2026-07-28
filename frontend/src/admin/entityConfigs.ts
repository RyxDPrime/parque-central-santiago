export interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file'
  options?: { value: string; label: string }[]
  accept?: string
  required?: boolean
}

export interface EntityConfig {
  path: string
  label: string
  fields: FieldConfig[]
  titleField: string
}

export const entityConfigs: EntityConfig[] = [
  {
    path: 'junta-directiva',
    label: 'Junta Directiva',
    titleField: 'institucion',
    fields: [
      { key: 'institucion', label: 'Institución', type: 'text', required: true },
      { key: 'representante', label: 'Representante', type: 'text', required: true },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true },
      { key: 'orden', label: 'Orden', type: 'number' },
    ],
  },
  {
    path: 'personal-tecnico',
    label: 'Personal Técnico',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true },
      { key: 'fotoUrl', label: 'Foto', type: 'file', accept: 'image/*' },
      { key: 'orden', label: 'Orden', type: 'number' },
    ],
  },
  {
    path: 'instalaciones',
    label: 'Instalaciones',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
      { key: 'cantidad', label: 'Cantidad (opcional)', type: 'number' },
      { key: 'orden', label: 'Orden', type: 'number' },
    ],
  },
  {
    path: 'programas',
    label: 'Programas y Servicios',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'categoria', label: 'Categoría', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
      { key: 'orden', label: 'Orden', type: 'number' },
    ],
  },
  {
    path: 'actividades',
    label: 'Actividades',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción (opcional)', type: 'textarea' },
      { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
      { key: 'fechaFin', label: 'Fecha de fin (opcional)', type: 'date' },
      { key: 'lugar', label: 'Lugar (opcional)', type: 'text' },
    ],
  },
  {
    path: 'galeria',
    label: 'Galería',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título (opcional)', type: 'text' },
      { key: 'url', label: 'Foto', type: 'file', accept: 'image/*', required: true },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'imagen', label: 'Imagen' },
          { value: 'video', label: 'Video' },
        ],
      },
      { key: 'categoria', label: 'Categoría (opcional)', type: 'text' },
      { key: 'orden', label: 'Orden', type: 'number' },
    ],
  },
  {
    path: 'documentos-financieros',
    label: 'Estados Financieros',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'auditado', label: 'Auditado' },
          { value: 'sin_auditar', label: 'Sin auditar' },
        ],
      },
      { key: 'url', label: 'Documento (PDF)', type: 'file', accept: 'application/pdf', required: true },
      { key: 'fecha', label: 'Fecha (opcional)', type: 'date' },
      { key: 'orden', label: 'Orden', type: 'number' },
    ],
  },
]
