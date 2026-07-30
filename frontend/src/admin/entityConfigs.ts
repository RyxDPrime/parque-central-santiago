export interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file'
  options?: { value: string; label: string }[]
  accept?: string
  required?: boolean
  placeholder?: string
  showOnCreate?: boolean
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
      { key: 'institucion', label: 'Institución', type: 'text', required: true, placeholder: 'Ej: Asociación para el Desarrollo, Inc.' },
      { key: 'representante', label: 'Representante', type: 'text', required: true, placeholder: 'Ej: Juan Carlos Ortiz' },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Ej: Presidente' },
      { key: 'logoUrl', label: 'Logo de la institución', type: 'file', accept: 'image/*' },
      { key: 'orden', label: 'Orden', type: 'number', placeholder: '0', showOnCreate: false },
    ],
  },
  {
    path: 'personal-tecnico',
    label: 'Personal Técnico',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Jessica Diez' },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Ej: Asistente Administrativa' },
      { key: 'fotoUrl', label: 'Foto', type: 'file', accept: 'image/*' },
      { key: 'orden', label: 'Orden', type: 'number', placeholder: '0', showOnCreate: false },
    ],
  },
  {
    path: 'instalaciones',
    label: 'Instalaciones',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Canchas de Baloncesto' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Describe brevemente esta instalación...' },
      { key: 'cantidad', label: 'Cantidad (opcional)', type: 'number', placeholder: 'Ej: 2' },
      { key: 'orden', label: 'Orden', type: 'number', placeholder: '0', showOnCreate: false },
    ],
  },
  {
    path: 'programas',
    label: 'Programas y Servicios',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Cibao Fútbol Club' },
      { key: 'categoria', label: 'Categoría', type: 'text', required: true, placeholder: 'Ej: Deportivo · Fútbol' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Describe brevemente este programa...' },
      { key: 'orden', label: 'Orden', type: 'number', placeholder: '0', showOnCreate: false },
    ],
  },
  {
    path: 'actividades',
    label: 'Actividades',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Maratón 5K Club Banreservas' },
      { key: 'descripcion', label: 'Descripción (opcional)', type: 'textarea', placeholder: 'Detalles del evento...' },
      { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
      { key: 'fechaFin', label: 'Fecha de fin (opcional)', type: 'date' },
      { key: 'lugar', label: 'Lugar (opcional)', type: 'text', placeholder: 'Ej: Anfiteatro' },
    ],
  },
  {
    path: 'galeria',
    label: 'Galería',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título (opcional)', type: 'text', placeholder: 'Ej: Campo de fútbol' },
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
      { key: 'categoria', label: 'Categoría (opcional)', type: 'text', placeholder: 'Ej: Instalaciones, Eventos, Programas...' },
      { key: 'orden', label: 'Orden', type: 'number', placeholder: '0', showOnCreate: false },
    ],
  },
  {
    path: 'documentos-financieros',
    label: 'Estados Financieros',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Estados Financieros 2026' },
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
      { key: 'orden', label: 'Orden', type: 'number', placeholder: '0', showOnCreate: false },
    ],
  },
]
