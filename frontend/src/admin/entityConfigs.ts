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
  /** Sin alta ni borrado: el conjunto de registros es fijo. */
  soloEditar?: boolean
  label: string
  fields: FieldConfig[]
  titleField: string
  icon: string
  description: string
}

/**
 * Iconos disponibles para las secciones que los usan. Se ofrecen como lista
 * para que no haya que escribir el nombre tecnico a mano.
 */
export const ICONOS: { value: string; label: string }[] = [
  { value: 'ti-info-circle', label: 'Informacion' },
  { value: 'ti-alert-triangle', label: 'Advertencia' },
  { value: 'ti-tree', label: 'Arbol' },
  { value: 'ti-plant-2', label: 'Planta' },
  { value: 'ti-feather', label: 'Ave / pluma' },
  { value: 'ti-paw', label: 'Mascota' },
  { value: 'ti-trash', label: 'Basura' },
  { value: 'ti-ban', label: 'Prohibido' },
  { value: 'ti-shield-x', label: 'Sin armas' },
  { value: 'ti-flame-off', label: 'Sin fuego' },
  { value: 'ti-volume', label: 'Sonido' },
  { value: 'ti-users', label: 'Personas' },
  { value: 'ti-heart-handshake', label: 'Convivencia' },
  { value: 'ti-hand-heart', label: 'Voluntariado' },
  { value: 'ti-coin', label: 'Donacion' },
  { value: 'ti-calendar-search', label: 'Consultar fecha' },
  { value: 'ti-calendar-event', label: 'Calendario' },
  { value: 'ti-message-2', label: 'Mensaje' },
  { value: 'ti-checkbox', label: 'Confirmacion' },
  { value: 'ti-circle-check', label: 'Listo' },
  { value: 'ti-clock', label: 'Horario' },
  { value: 'ti-map-pin', label: 'Ubicacion' },
  { value: 'ti-building', label: 'Edificio' },
  { value: 'ti-run', label: 'Deporte' },
  { value: 'ti-photo', label: 'Foto' },
]

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
    path: 'hitos',
    icon: 'ti-timeline-event',
    description: 'Hitos de la historia del parque, en Sobre Nosotros → Historia.',
    label: 'Historia',
    titleField: 'titulo',
    fields: [
      { key: 'fecha', label: 'Fecha', type: 'text', required: true, placeholder: 'Ej: 20 feb 2018', hint: 'Se muestra tal como la escribas.' },
      { key: 'titulo', label: 'Título del hito', type: 'text', required: true, placeholder: 'Ej: Inauguración del parque' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué ocurrió en esa fecha...' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'normas',
    icon: 'ti-clipboard-list',
    description: 'Normas de convivencia, en Sobre Nosotros → Reglamento.',
    label: 'Reglamento',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título de la norma', type: 'text', required: true, placeholder: 'Ej: Cuida las áreas verdes' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'En qué consiste la norma...' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'pasos-reserva',
    icon: 'ti-list-numbers',
    description: 'Pasos para reservar un espacio, en la página de Reserva.',
    label: 'Pasos de Reserva',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título del paso', type: 'text', required: true, placeholder: 'Ej: Consulta disponibilidad' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué debe hacer el visitante...' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'formas-apoyo',
    icon: 'ti-heart-handshake',
    description: 'Formas de apoyar al parque, en la página de Apóyanos.',
    label: 'Formas de Apoyo',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Ser voluntario' },
      { key: 'etiqueta', label: 'Etiqueta', type: 'text', required: true, placeholder: 'Ej: Voluntariado', hint: 'Palabra corta que aparece sobre el título.' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'En qué consiste esta forma de apoyo...' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'cifras',
    icon: 'ti-chart-bar',
    description: 'Cifras destacadas de la página de inicio, con su foto y enlace.',
    label: 'Cifras del Inicio',
    titleField: 'numero',
    fields: [
      { key: 'numero', label: 'Cifra', type: 'text', required: true, placeholder: 'Ej: 2 campos', hint: 'El número grande. Puede llevar texto, como "32 kioscos".' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué representa esta cifra...' },
      { key: 'etiqueta', label: 'Etiqueta sobre la foto (opcional)', type: 'text', placeholder: 'Ej: Complejo Deportivo' },
      { key: 'imagenUrl', label: 'Foto (opcional)', type: 'file', accept: 'image/*', aspect: 16 / 9 },
      { key: 'enlaceTexto', label: 'Texto del enlace (opcional)', type: 'text', placeholder: 'Ej: Ver instalaciones y servicios' },
      { key: 'enlaceUrl', label: 'Dirección del enlace (opcional)', type: 'text', placeholder: 'Ej: /instalaciones-y-servicios', hint: 'Ruta dentro del sitio, empezando con /' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'encabezados',
    icon: 'ti-photo-scan',
    description: 'Foto de la franja superior de cada página. El conjunto es fijo: solo se cambia la imagen.',
    label: 'Fotos de Encabezado',
    titleField: 'etiqueta',
    soloEditar: true,
    fields: [
      { key: 'etiqueta', label: 'Página', type: 'text' },
      { key: 'imagenUrl', label: 'Foto de la franja', type: 'file', accept: 'image/*', aspect: 16 / 5 },
      {
        key: 'posicion',
        label: 'Encuadre vertical',
        type: 'select',
        options: [
          { value: 'center', label: 'Centrado' },
          { value: 'center 20%', label: 'Hacia arriba' },
          { value: 'top', label: 'Borde superior' },
          { value: 'center 80%', label: 'Hacia abajo' },
          { value: 'bottom', label: 'Borde inferior' },
        ],
        hint: 'Qué parte de la foto se ve cuando es más alta que la franja.',
      },
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
