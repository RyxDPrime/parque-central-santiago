export interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file' | 'checkbox'
  /** Texto explicativo bajo el campo. */
  hint?: string
  /**
   * Proporción (ancho/alto) con la que se mostrará la imagen en el sitio. El
   * recuadro de recorte usa esta misma forma. Si se omite, se conserva la
   * proporción original de la foto.
   */
  aspect?: number
  options?: { value: string; label: string }[]
  accept?: string
  required?: boolean
  placeholder?: string
  showOnCreate?: boolean
  /** Se propone la última posición y se renumera el resto al guardar. */
  nextPosition?: boolean
}

export interface EntityConfig {
  path: string
  label: string
  fields: FieldConfig[]
  titleField: string
  icon: string
  description: string
}

export const entityConfigs: EntityConfig[] = [
  {
    path: 'junta-directiva',
    icon: 'ti-building-bank',
    description: 'Instituciones que conforman el Patronato y sus representantes.',
    label: 'Junta Directiva',
    titleField: 'institucion',
    fields: [
      { key: 'institucion', label: 'Institución', type: 'text', required: true, placeholder: 'Ej: Asociación para el Desarrollo, Inc.' },
      { key: 'representante', label: 'Representante', type: 'text', required: true, placeholder: 'Ej: Juan Carlos Ortiz' },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Ej: Presidente' },
      { key: 'fotoUrl', label: 'Foto del representante', type: 'file', accept: 'image/*', aspect: 1 },
      { key: 'logoUrl', label: 'Logo de la institución', type: 'file', accept: 'image/*', aspect: 1 },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'personal-tecnico',
    icon: 'ti-users',
    description: 'Equipo administrativo y técnico que trabaja en el parque.',
    label: 'Personal Técnico',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Jessica Diez' },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Ej: Asistente Administrativa' },
      { key: 'bio', label: 'Biografía', type: 'textarea', placeholder: 'Breve reseña profesional del miembro del equipo (opcional)' },
      { key: 'fotoUrl', label: 'Foto', type: 'file', accept: 'image/*', aspect: 1 },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'instalaciones',
    icon: 'ti-building-stadium',
    description: 'Áreas y facilidades disponibles dentro del parque.',
    label: 'Instalaciones',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Canchas de Baloncesto' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Describe brevemente esta instalación...' },
      { key: 'cantidad', label: 'Cantidad (opcional)', type: 'number', placeholder: 'Ej: 2' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'programas',
    icon: 'ti-plant-2',
    description: 'Programas y servicios activos que ofrece el parque.',
    label: 'Programas y Servicios',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Cibao Fútbol Club' },
      { key: 'categoria', label: 'Categoría', type: 'text', required: true, placeholder: 'Ej: Deportivo · Fútbol' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Describe brevemente este programa...' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'actividades',
    icon: 'ti-calendar-event',
    description: 'Agenda de eventos y actividades programadas.',
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
    path: 'publicaciones',
    icon: 'ti-news',
    description: 'Artículos y noticias del blog. Se ordenan por fecha, de la más reciente a la más antigua.',
    label: 'Blog',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Jornada de reforestación en el parque' },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'noticia', label: 'Noticia' },
          { value: 'articulo', label: 'Artículo' },
        ],
      },
      { key: 'fecha', label: 'Fecha de publicación', type: 'date', required: true },
      { key: 'resumen', label: 'Resumen (opcional)', type: 'textarea', placeholder: 'Una o dos líneas que resuman la publicación. Se muestran en el listado.' },
      { key: 'contenido', label: 'Contenido', type: 'textarea', required: true, placeholder: 'Texto completo de la publicación...' },
      { key: 'imagenUrl', label: 'Imagen (opcional)', type: 'file', accept: 'image/*', aspect: 16 / 9 },
      {
        key: 'destacada',
        label: 'Anunciar en la página de inicio',
        type: 'checkbox',
        hint: 'Aparece en la barra superior y en una ventana emergente al entrar al sitio. Si marcas varias, se anuncia la más reciente.',
      },
    ],
  },
  {
    path: 'puntos-mapa',
    icon: 'ti-map-pin',
    description: 'Instalaciones señaladas sobre el mapa, en El Parque → Mapa y en la página de inicio.',
    label: 'Puntos del Mapa',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre del punto', type: 'text', required: true, placeholder: 'Ej: Canchas de Baloncesto' },
      { key: 'zona', label: 'Zona (opcional)', type: 'text', placeholder: 'Ej: Zona deportiva' },
      {
        key: 'lat',
        label: 'Latitud',
        type: 'number',
        required: true,
        placeholder: '19.4667',
        hint: 'Coordenada del punto. Se obtiene en Google Maps: clic derecho sobre el lugar y copiar las coordenadas (el primer número).',
      },
      {
        key: 'lng',
        label: 'Longitud',
        type: 'number',
        required: true,
        placeholder: '-70.6953',
        hint: 'El segundo número de las coordenadas de Google Maps. En Santiago es negativo.',
      },
      { key: 'fotoUrl', label: 'Foto (opcional)', type: 'file', accept: 'image/*', aspect: 16 / 9 },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'galeria',
    icon: 'ti-photo',
    description: 'Fotografías y videos que se muestran en la galería pública.',
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
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'documentos-financieros',
    icon: 'ti-file-invoice',
    description: 'Estados financieros auditados y sin auditar del Patronato.',
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
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
]
