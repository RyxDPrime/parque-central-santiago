# Parque Central de Santiago — Estado del proyecto

**Última actualización:** 7 de agosto de 2026
**Repositorio:** `RyxDPrime/parque-central-santiago`

---

## Estado actual

Los tres servicios están en línea en Railway:

| Servicio | Estado | Dirección |
|---|---|---|
| Frontend (React + Vite) | En línea | https://frontend-production-d6d8f.up.railway.app |
| Backend (Express + Prisma) | En línea | https://backend-production-b261.up.railway.app/api |
| Base de datos (PostgreSQL) | En línea | Interna, con disco persistente |

**20 rutas públicas** y **9 secciones administrables**. Contenido cargado:

| Sección | Registros |
|---|---|
| Junta Directiva | 17 |
| Personal Técnico | 5 |
| Instalaciones | 14 |
| Programas y Servicios | 5 |
| Actividades | 13 |
| Galería | 15 |
| Puntos del Mapa | 8 |
| Blog | 1 |
| Estados Financieros | 0 |

---

## El sitio público

### Inicio
Portada con foto, accesos rápidos, sección de cifras, carrusel de programas y banner de apoyo. Muestra una **ventana emergente** cuando hay una publicación marcada como anuncio.

### Sobre Nosotros
- **Historia** — línea de tiempo con los dos hitos fundacionales (inauguración del 20 de febrero de 2018 y constitución del Patronato el 6 de abril de 2018) y la relación con APEDI.
- **Reglamento** — 12 normas de convivencia en cuadrícula con iconografía.

### Institución
- **Junta Directiva** — galería de liderazgo en cuadrícula de 5 columnas, al estilo del Banco Mundial: foto del representante, institución y cargo. Cuando hay foto y logo, el logo pasa a un sello en la esquina. Al pasar el mouse, el marco se realza y la foto se agranda.
- **Personal Técnico** — filas intercaladas (zigzag) con foto cuadrada de 200px, nombre, cargo y biografía.
- **Transparencia** — quiénes somos, marco legal y dos bloques para estados financieros auditados y sin auditar.

### El Parque
- **Instalaciones y Servicios** — las instalaciones con foto real se muestran en tarjetas con imagen; las demás con iconografía. Los servicios van en filas alternadas.
- **Programas y Proyectos** — los 5 programas activos con ícono por categoría.
- **Galería** — mosaico que respeta la proporción de cada foto, con ventana ampliada al hacer clic.
- **Mapa** — vista aérea real del parque con marcadores numerados que se resaltan junto a su ficha. Los puntos salen de la base de datos y se editan desde el panel; sus coordenadas son provisionales hasta que llegue el plano oficial.

### Reserva
Calendario de actividades (agenda cronológica agrupada por mes) y guía de tres pasos para reservar un espacio.

### Blog
Artículos y noticias en dos columnas, ordenados por fecha. Al abrir una publicación se ve el contenido completo.

### Apóyanos y Contacto
Tres formas de apoyar al parque, y formulario de contacto con los datos reales de ubicación, teléfono, WhatsApp y horarios.

### Detalles transversales
- Encabezado de cada sección con **foto real del parque difuminada** hacia el verde institucional, distinta por página.
- **Menú móvil** desplegable con las 20 rutas.
- **Página de error 404** con atajos a las secciones principales.
- **Título, descripción y previsualización** propios por página, para buscadores y para compartir el enlace.
- Barra superior con el horario del parque, o con el anuncio activo cuando lo hay.
- **Botón flotante** que aparece al bajar y devuelve al tope de la página.
- Correo, teléfono y WhatsApp **enlazados** en Contacto y en el pie: abren la aplicación correspondiente.

---

## El panel de administración

Acceso desde el pie de página o en `/admin/login`.

**Credenciales:** 
- usuario `pcs.admin`
- contraseña: `AdminPCS2018!`


### Qué se puede editar
Junta Directiva, Personal Técnico, Instalaciones, Programas, Actividades, Blog, Puntos del Mapa, Galería y Estados Financieros. Además, una **bandeja de mensajes** de contacto.

### Cómo funciona
- **Formularios en tarjeta** con campos obligatorios marcados, campos largos a ancho completo y barra de acciones separada.
- **Tablas con scroll propio** y encabezado fijo, más **buscador, filtros y ordenamiento** en cada sección.
- **Posición en la lista** que se renumera sola: al insertar en una posición ocupada, las siguientes bajan un puesto; al borrar, se cierra el hueco. Nunca quedan números repetidos.
- **Carga de archivos con arrastrar y soltar**, vista previa y **ventana de encuadre** al estilo de WhatsApp: se arrastra y se acerca la foto, con opción de usar el recorte o la foto entera. El recuadro tiene la forma exacta con la que se verá en la página (cuadrada en personas, 16:9 en el blog, original en la galería).
- **Anuncios**: una casilla en el blog publica la noticia en la barra superior y en la ventana emergente del inicio. No vuelve a aparecer una vez cerrada, hasta que se publique otra.

### La bandeja de mensajes
Lista los mensajes del formulario de contacto, con botón para responder por correo. Marca **"Sin notificar"** los que no se pudieron enviar por correo, que era el caso donde un mensaje podía perderse en silencio.

---

## Correcciones aplicadas

Errores encontrados y resueltos durante el desarrollo:

| Problema | Causa |
|---|---|
| El campo de fecha no dejaba guardar | El formulario enviaba solo el día y la base de datos exige fecha y hora completas. Afectaba a Actividades, Estados Financieros y Blog. |
| El encabezado no servía en móvil | El logo se comprimía a cero y no había menú: 19 de 20 páginas solo se alcanzaban desde el pie. |
| Una dirección inválida daba pantalla en blanco | No existía página de error. |
| Todos los registros nuevos quedaban en la posición 0 | No se calculaba la siguiente posición ni se renumeraba el resto. |
| Los datos se arrastraban entre secciones del panel | Al cambiar de sección no se soltaba el registro en edición, y varias entidades comparten nombres de campo. |
| Al guardar no se limpiaba el campo de foto | El nombre y la vista previa son estado interno que el reinicio del formulario no tocaba. |
| El recorte no coincidía con lo mostrado | El recuadro siempre era cuadrado, pero el sitio volvía a recortar la imagen según cada destino. |
| Los "sin documentos" se veían descuadrados | Una regla del título se filtraba al texto interno y lo desplazaba a la izquierda. |


---

## Revisión de seguridad

Revisión completa realizada el 7 de agosto de 2026 sobre base de datos, seguridad y modularización. Todo lo siguiente ya está corregido y desplegado.

### Vulnerabilidades corregidas

| Hallazgo | Riesgo | Estado |
|---|---|---|
| **Ejecución de archivos subidos.** La extensión salía del nombre que envía el cliente y el tipo también lo declara el cliente, así que se podía subir un `.html` haciéndolo pasar por imagen. Quedaba servido como página ejecutable en el dominio del backend. Comprobado en producción antes de corregirlo. | Alto | La extensión ahora sale del tipo validado; los archivos se sirven con `nosniff` y una política que impide ejecutarlos. SVG queda rechazado. |
| **Inyección de encabezados de correo.** El campo "asunto" del formulario público va al encabezado Subject, y `trim()` no quita saltos de línea internos: se podían inyectar encabezados como un `Bcc`. | Alto | Los campos de una línea se limpian de caracteres de control. Es la única vía sin autenticación, así que era la de mayor exposición. |
| **`nodemailer` con vulnerabilidades conocidas** de severidad alta (inyección de comandos SMTP, lectura de archivos). | Alto | Actualizado a la versión 9, sin vulnerabilidades pendientes. |
| **Sin límite de intentos** en el inicio de sesión: la contraseña es una sola y compartida, así que se podía probar sin freno. | Medio | 10 intentos por cuarto de hora en el acceso, 5 mensajes por hora en el formulario, y un límite general en la API. |
| **Permiso de CORS para localhost activo en producción.** Dependía de `NODE_ENV`, que no está definida en el despliegue. | Medio | Ahora depende de la presencia de `CORS_ORIGIN`, que sí está configurada. |
| **Asignación masiva.** Las rutas del panel pasaban el cuerpo completo de la petición a la base de datos, así que se podían escribir campos que el formulario no muestra. | Medio | Cada modelo declara qué campos acepta. |
| **Secretos con valor vacío por defecto.** Si faltaban `JWT_SECRET` o las credenciales, el servidor arrancaba igual en un estado inconsistente. | Medio | Ahora son obligatorios: sin ellos el servidor no inicia. |
| **Sin cabeceras de seguridad.** | Bajo | Se agregó `helmet`. |

### Riesgos asumidos, documentados

- **La sesión se guarda en el navegador** (`localStorage`), no en una cookie protegida. Es lo que permite que frontend y backend vivan en dominios distintos sin complicar el flujo; la contrapartida es que un fallo de scripting en el frontend podría leerla.
- **La sesión dura 7 días y no se puede revocar** una por una. Cambiar la contraseña no cierra las sesiones ya abiertas; para eso hay que cambiar también `JWT_SECRET`.
- **Credencial única compartida** por todo el equipo: no queda registro de quién hizo cada cambio.
- **Sin índices en la base de datos.** Con tablas de decenas de filas no afecta; conviene revisarlo si la bandeja de mensajes crece mucho.

### Modularización

El backend está separado por responsabilidad (configuración, middleware, rutas, esquemas) y ningún archivo pasa de 170 líneas. En el frontend, `EntityManager.tsx` (491 líneas) concentra formulario, barra de herramientas y tabla, y `global.css` (698 líneas) reúne todos los estilos. Ninguno de los dos es un problema hoy, pero son los primeros candidatos a dividir si el proyecto sigue creciendo.

---

## Lo que falta

### Contenido que debe entregar el Parque
- **Estados financieros** auditados y sin auditar (la sección está lista, sin documentos aún).
- **Fotos de los miembros** de la Junta Directiva: 17 de 18 no tienen foto y se muestran con un ícono.
- **Biografías** del personal técnico: se muestra un texto de relleno en cursiva mientras no estén.
- **Artículos y noticias** para el blog.
- **Misión, visión y valores**, pendientes de definición en Junta Directiva.
- **Plano oficial** del parque, para reemplazar el mapa referencial.

### Pendientes técnicos
- **Cuenta de correo del parque.** Los mensajes ya llegan a `asistentepcs@gmail.com`, pero se envían desde una cuenta personal porque el proveedor exige que coincida con la cuenta autenticada. Hace falta acceso al correo del parque para generar una contraseña de aplicación.
- `robots.txt` y `sitemap.xml` para buscadores.
- **Borrar dos archivos de prueba** que quedaron en el disco del backend al comprobar la vulnerabilidad de subidas: `1786194961303-prueba-extension.html` y `1786195600044-ataque.png`. Están neutralizados por la política de seguridad, pero conviene eliminarlos. Requiere acceso al contenedor (`railway ssh`, que necesita una clave SSH configurada en tu cuenta).

---

## Notas para quien continúe

- El contenido del sitio se edita **solo desde el panel**, sin tocar código.
- La carga inicial (`backend/prisma/seed.ts`) sirve para levantar una base desde cero; no se ejecuta sola para no pisar lo que se edite desde el panel.
- Las fotos subidas se guardan en un **disco persistente** del backend, así que sobreviven a los despliegues.
- Las imágenes cargadas antes del 6 de agosto quedaron guardadas como cuadrado. En el blog se verían con recorte lateral; para corregirlas basta volver a subirlas.
