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
  /**
   * Grupo de "textos del sitio" que se edita dentro de esta misma pantalla.
   * Cuando una sección tiene textos sueltos que le pertenecen, se muestran
   * aquí en vez de en una lista aparte: se administran donde se usan.
   */
  textosGrupo?: string
}

/**
 * Grupos de textos que no pertenecen a ninguna sección con tabla y por eso
 * tienen su propia pantalla, en `/admin/textos/:slug`.
 */
export interface TextoSeccion {
  slug: string
  /** Nombre del grupo tal como está guardado en la base. */
  grupo: string
  label: string
  icon: string
  description: string
}

/**
 * Fotos sueltas de un bloque con nombre propio. Se guardan en la misma tabla
 * que las franjas de encabezado, pero tienen pantalla propia en
 * `/admin/foto/:clave` porque buscarlas entre todos los banners no es práctico.
 */
export interface FotoSeccionConfig {
  clave: string
  label: string
  icon: string
  description: string
  /** Proporción con la que se muestra en el sitio, para el recorte. */
  aspect?: number
}

export const fotoSecciones: FotoSeccionConfig[] = [
  {
    clave: 'inicio-quienes',
    label: 'Quiénes somos',
    icon: 'ti-photo-heart',
    description: 'Foto del bloque "Quiénes somos" de la página de inicio.',
    // El recuadro del sitio es apaisado (unos 1200×340).
    aspect: 16 / 9,
  },
]

export const textoSecciones: TextoSeccion[] = [
  {
    slug: 'inicio',
    grupo: 'Inicio',
    label: 'Portada',
    icon: 'ti-home',
    description: 'Título y texto grande que se ven al abrir el sitio.',
  },
  {
    slug: 'titulos-inicio',
    grupo: 'Títulos del inicio',
    label: 'Títulos y textos',
    icon: 'ti-text-caption',
    description: 'Encabezados de cada bloque de la página de inicio.',
  },
  {
    slug: 'contacto',
    grupo: 'Contacto',
    label: 'Contacto',
    icon: 'ti-address-book',
    description: 'Dirección, teléfono, WhatsApp, correo y horarios. Se usan en todo el sitio.',
  },
]

/**
 * Iconos disponibles para las secciones que los usan. Se ofrecen como lista
 * para que no haya que escribir el nombre tecnico a mano.
 */
export const ICONOS: { value: string; label: string }[] = [
  { value: 'ti-target-arrow', label: 'Diana / objetivo' },
  { value: 'ti-eye', label: 'Ojo / vision' },
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
  { value: 'ti-friends', label: 'Voluntariado' },
  { value: 'ti-heart-plus', label: 'Compromiso' },
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
    description: 'Tarjetas de la página Institución → Junta Directiva. Cada registro es una institución del Patronato con su representante.',
    label: 'Junta Directiva',
    textosGrupo: 'Junta Directiva',
    titleField: 'institucion',
    fields: [
      { key: 'institucion', label: 'Institución', type: 'text', required: true, placeholder: 'Ej: Asociación para el Desarrollo, Inc.', hint: 'Nombre que aparece bajo la foto, en negrita.' },
      { key: 'representante', label: 'Representante', type: 'text', required: true, placeholder: 'Ej: Juan Carlos Ortiz', hint: 'La persona que representa a la institución. Es el título de la tarjeta.' },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Ej: Presidente', hint: 'Puesto dentro de la Junta. Es la última línea de la tarjeta.' },
      { key: 'fotoUrl', label: 'Foto del representante', type: 'file', accept: 'image/*', aspect: 1, hint: 'Solo se usa si arriba eliges mostrar fotos en vez de logos.' },
      { key: 'logoUrl', label: 'Logo de la institución', type: 'file', accept: 'image/*', aspect: 1, hint: 'Lo que se ve hoy en el recuadro de la tarjeta, sobre fondo blanco.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'personal-tecnico',
    icon: 'ti-users',
    description: 'Tarjetas de la página Institución → Personal Técnico. Cada registro es una persona del equipo del parque.',
    label: 'Personal Técnico',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Jessica Diez', hint: 'Título de la tarjeta.' },
      { key: 'cargo', label: 'Cargo', type: 'text', required: true, placeholder: 'Ej: Asistente Administrativa', hint: 'Puesto que ocupa. Se muestra debajo del nombre.' },
      { key: 'fotoUrl', label: 'Foto', type: 'file', accept: 'image/*', aspect: 1, hint: 'Retrato de la persona. Sin foto se muestra un ícono en su lugar.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'instalaciones',
    icon: 'ti-building-stadium',
    description: 'Primera mitad de la página El Parque → Instalaciones y Servicios. Cada registro es un área o facilidad del parque.',
    label: 'Instalaciones',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Canchas de Baloncesto', hint: 'Título de la instalación en la página.' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Describe brevemente esta instalación...', hint: 'Texto que acompaña al nombre. Una o dos líneas.' },
      { key: 'cantidad', label: 'Cantidad (opcional)', type: 'number', placeholder: 'Ej: 2', hint: 'Cuántas hay. Se muestra como un número destacado; déjalo vacío si no aplica.' },
      { key: 'fotoUrl', label: 'Foto (opcional)', type: 'file', accept: 'image/*', aspect: 4 / 3, hint: 'Con foto se muestra como tarjeta grande; sin foto, en la lista con ícono.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'programas',
    icon: 'ti-plant-2',
    description: 'Segunda mitad de la página El Parque → Instalaciones y Servicios, y la página Programas y Proyectos. Cada registro es un servicio o programa.',
    label: 'Programas y Servicios',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Cibao Fútbol Club', hint: 'Título del servicio en la página.' },
      { key: 'categoria', label: 'Categoría', type: 'text', required: true, placeholder: 'Ej: Deportivo · Fútbol', hint: 'Etiqueta verde que aparece encima del título.' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Describe brevemente este programa...', hint: 'Texto que se lee junto a la foto.' },
      { key: 'fotoUrl', label: 'Foto (opcional)', type: 'file', accept: 'image/*', aspect: 4 / 3, hint: 'Foto grande que acompaña al servicio. Sin foto se usa una general del parque.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'actividades',
    icon: 'ti-calendar-event',
    description: 'Agenda de la página Reserva → Actividades. Se agrupa sola por mes, y al pulsar una fila se abre su ventana de detalles.',
    label: 'Actividades',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Maratón 5K Club Banreservas', hint: 'Nombre del evento en la agenda.' },
      { key: 'descripcion', label: 'Descripción (opcional)', type: 'textarea', placeholder: 'Detalles del evento...', hint: 'Se ve completa en la ventana de detalles que se abre al pulsar la actividad.' },
      { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true, hint: 'Decide en qué mes se agrupa la actividad y el día que sale en el recuadro verde.' },
      { key: 'fechaFin', label: 'Fecha de fin (opcional)', type: 'date', hint: 'Solo para eventos de varios días. Se muestra como un rango de fechas.' },
      { key: 'lugar', label: 'Lugar (opcional)', type: 'text', placeholder: 'Ej: Anfiteatro', hint: 'Dónde se realiza. Aparece con un ícono de ubicación.' },
    ],
  },
  {
    path: 'publicaciones',
    icon: 'ti-news',
    description: 'Publicaciones de la página Blog. Se ordenan por fecha, de la más reciente a la más antigua.',
    label: 'Blog',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Jornada de reforestación en el parque', hint: 'Titular de la publicación.' },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'noticia', label: 'Noticia' },
          { value: 'articulo', label: 'Artículo' },
        ],
      },
      { key: 'fecha', label: 'Fecha de publicación', type: 'date', required: true, hint: 'Decide el orden del listado: las más recientes salen primero.' },
      { key: 'resumen', label: 'Resumen (opcional)', type: 'textarea', placeholder: 'Una o dos líneas que resuman la publicación.', hint: 'Lo que se lee en el listado del blog, antes de abrir la publicación.' },
      { key: 'contenido', label: 'Contenido', type: 'textarea', required: true, placeholder: 'Texto completo de la publicación...', hint: 'El cuerpo completo, que se ve al abrir la publicación.' },
      { key: 'imagenUrl', label: 'Imagen (opcional)', type: 'file', accept: 'image/*', aspect: 16 / 9, hint: 'Foto de portada de la publicación, en el listado y al abrirla.' },
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
    description: 'Marcadores del mapa. Los mismos puntos se ven en El Parque → Mapa y en el mapa pequeño de la página de inicio.',
    label: 'Puntos del Mapa',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre del punto', type: 'text', required: true, placeholder: 'Ej: Canchas de Baloncesto', hint: 'Lo que se lee al pulsar el marcador en el mapa.' },
      { key: 'zona', label: 'Zona (opcional)', type: 'text', placeholder: 'Ej: Zona deportiva', hint: 'Área del parque a la que pertenece. Acompaña al nombre.' },
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
      { key: 'fotoUrl', label: 'Foto (opcional)', type: 'file', accept: 'image/*', aspect: 16 / 9, hint: 'Se muestra dentro del globo del marcador.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'hitos',
    icon: 'ti-timeline-event',
    description: 'La historia del parque: el texto corrido, el formato y los hitos de la línea de tiempo.',
    label: 'Historia',
    textosGrupo: 'Historia',
    titleField: 'titulo',
    fields: [
      { key: 'fecha', label: 'Fecha', type: 'text', required: true, placeholder: 'Ej: 20 feb 2018', hint: 'Etiqueta verde del hito. Se muestra tal como la escribas: 2005, Feb 2009, 20 feb 2018.' },
      { key: 'titulo', label: 'Título del hito', type: 'text', required: true, placeholder: 'Ej: Inauguración del parque', hint: 'Qué pasó. Es el título del punto en la línea de tiempo.' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué ocurrió en esa fecha...', hint: 'El detalle del hito. Solo se ve si la historia está en formato de línea de tiempo.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'valores',
    icon: 'ti-target-arrow',
    description: 'La página El Parque → Misión, Visión y Valores. Arriba, los dos párrafos; abajo, cada valor con su ícono.',
    label: 'Misión, Visión y Valores',
    textosGrupo: 'Misión, Visión y Valores',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Nombre del valor', type: 'text', required: true, placeholder: 'Ej: Compromiso ambiental', hint: 'Título de la tarjeta en la página.' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué significa este valor para el Parque...', hint: 'Explicación del valor, debajo del título.' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS, hint: 'Dibujo que acompaña a la tarjeta en la página.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'normas',
    icon: 'ti-clipboard-list',
    description: 'Tarjetas de la página Sobre Nosotros → Reglamento. Cada registro es una norma de convivencia.',
    label: 'Reglamento',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título de la norma', type: 'text', required: true, placeholder: 'Ej: Cuida las áreas verdes', hint: 'Título de la tarjeta en el reglamento.' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'En qué consiste la norma...', hint: 'Explicación de la norma, debajo del título.' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS, hint: 'Dibujo que acompaña a la tarjeta en la página.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'pasos-reserva',
    icon: 'ti-list-numbers',
    description: 'La página de Reserva: los pasos para reservar un espacio y el texto del calendario.',
    label: 'Reserva',
    textosGrupo: 'Reserva',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título del paso', type: 'text', required: true, placeholder: 'Ej: Consulta disponibilidad', hint: 'Título del paso. El número lo pone la página sola, según la posición.' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué debe hacer el visitante...', hint: 'Qué tiene que hacer el visitante en este paso.' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS, hint: 'Dibujo que acompaña a la tarjeta en la página.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'formas-apoyo',
    icon: 'ti-heart-handshake',
    description: 'Tarjetas de la página Apóyanos. Cada registro es una forma de colaborar con el parque.',
    label: 'Formas de Apoyo',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Ser voluntario', hint: 'Título de la tarjeta en Apóyanos.' },
      { key: 'etiqueta', label: 'Etiqueta', type: 'text', required: true, placeholder: 'Ej: Voluntariado', hint: 'Palabra corta que aparece sobre el título, como una etiqueta.' },
      { key: 'texto', label: 'Descripción', type: 'textarea', required: true, placeholder: 'En qué consiste esta forma de apoyo...', hint: 'Explicación de cómo colaborar de esta forma.' },
      { key: 'icono', label: 'Ícono', type: 'select', options: ICONOS, hint: 'Dibujo que acompaña a la tarjeta en la página.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'cifras',
    icon: 'ti-chart-bar',
    description: 'Bloques grandes con foto de la página de inicio, debajo del título principal. Se alternan solos a izquierda y derecha.',
    label: 'Cifras del Inicio',
    titleField: 'numero',
    fields: [
      { key: 'numero', label: 'Cifra', type: 'text', required: true, placeholder: 'Ej: 2 campos', hint: 'El texto grande del bloque. Puede ser un número (450), un número con palabra (32 kioscos) o un título (Instalaciones y espacios): si es largo se achica solo.' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true, placeholder: 'Qué representa esta cifra...', hint: 'Texto que se lee debajo. Deja una línea en blanco para separar párrafos.' },
      { key: 'etiqueta', label: 'Etiqueta sobre la foto (opcional)', type: 'text', placeholder: 'Ej: Complejo Deportivo', hint: 'Pastilla blanca que se ve sobre la esquina de la foto.' },
      { key: 'imagenUrl', label: 'Foto (opcional)', type: 'file', accept: 'image/*', aspect: 16 / 9, hint: 'Foto grande del bloque, al lado del texto.' },
      { key: 'enlaceTexto', label: 'Texto del enlace (opcional)', type: 'text', placeholder: 'Ej: Ver instalaciones y servicios', hint: 'Botón verde al pie del bloque. Déjalo vacío si no quieres botón.' },
      { key: 'enlaceUrl', label: 'Dirección del enlace (opcional)', type: 'text', placeholder: 'Ej: /instalaciones-y-servicios', hint: 'A dónde lleva el botón. Ruta dentro del sitio, empezando con /' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'aliados',
    icon: 'ti-building-arch',
    description: 'Carrusel de logos de la página Sobre Nosotros → Historia. Avanza solo, y también con las flechas.',
    label: 'Logos Institucionales',
    titleField: 'nombre',
    fields: [
      { key: 'nombre', label: 'Nombre de la institución', type: 'text', required: true, placeholder: 'Ej: Asociación para el Desarrollo, Inc.', hint: 'Se muestra dentro del carrusel cuando la institución todavía no tiene logo cargado.' },
      { key: 'logoUrl', label: 'Logo', type: 'file', accept: 'image/*', hint: 'Imagen que gira en el carrusel. Mejor con fondo transparente o blanco.' },
      { key: 'sitioWeb', label: 'Sitio web (opcional)', type: 'text', placeholder: 'Ej: https://www.ejemplo.com', hint: 'Si lo indicas, el logo se vuelve un enlace que abre esa página.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'encabezados',
    icon: 'ti-photo-scan',
    description: 'La franja verde con foto que encabeza cada página. La lista es fija: no se crean ni se borran registros, solo se cambia la foto de cada uno.',
    label: 'Fotos de Encabezado',
    titleField: 'etiqueta',
    soloEditar: true,
    fields: [
      { key: 'etiqueta', label: 'Página', type: 'text', hint: 'A qué página del sitio corresponde esta franja.' },
      { key: 'imagenUrl', label: 'Foto de la franja', type: 'file', accept: 'image/*', aspect: 16 / 5, hint: 'Con "Dejar sin foto" la franja queda solo con el fondo verde.' },
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
    description: 'Fotos de la página El Parque → Galería.',
    label: 'Galería',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título (opcional)', type: 'text', placeholder: 'Ej: Campo de fútbol', hint: 'Pie de foto. Se ve al pasar el mouse por encima.' },
      { key: 'url', label: 'Foto', type: 'file', accept: 'image/*', required: true, hint: 'La imagen que se agrega a la galería.' },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'imagen', label: 'Imagen' },
          { value: 'video', label: 'Video' },
        ],
      },
      { key: 'categoria', label: 'Categoría (opcional)', type: 'text', placeholder: 'Ej: Instalaciones, Eventos, Programas...', hint: 'Agrupa la foto para poder filtrarla en la galería.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
  {
    path: 'documentos-financieros',
    icon: 'ti-file-invoice',
    description: 'La página de Transparencia: sus textos institucionales y los estados financieros publicados.',
    label: 'Transparencia',
    textosGrupo: 'Transparencia',
    titleField: 'titulo',
    fields: [
      { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ej: Estados Financieros 2026', hint: 'Nombre con el que se lista el documento.' },
      {
        key: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: [
          { value: 'auditado', label: 'Auditado' },
          { value: 'sin_auditar', label: 'Sin auditar' },
        ],
      },
      { key: 'url', label: 'Documento (PDF)', type: 'file', accept: 'application/pdf', required: true, hint: 'El archivo que se descarga al pulsar el documento.' },
      { key: 'fecha', label: 'Fecha (opcional)', type: 'date', hint: 'Fecha del documento. Se muestra junto al título.' },
      { key: 'orden', label: 'Posición en la lista', type: 'number', placeholder: '1', nextPosition: true },
    ],
  },
]
