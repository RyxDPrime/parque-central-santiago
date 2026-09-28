# Parque Central de Santiago — Sitio Web

Sitio web institucional del Parque Central de Santiago, desarrollado por **Ureña Limited Partners (ULP)**.

Tres piezas que se despliegan juntas: el sitio público, un panel administrativo desde el que el Parque edita casi todo lo que se ve, y las gestiones que recibe en línea — solicitudes de reserva de espacios, intenciones de aporte, contacto y sugerencias.

En línea en **https://www.parquecentralsantiagord.com** · panel en `/admin`.

## Estructura

```
parque-central-santiago/
├── backend/     API · Node 22 + Express + TypeScript + Prisma 7 + PostgreSQL
│   ├── prisma/      esquema, migraciones y semillas
│   ├── scripts/     respaldo, restauración y mantenimiento
│   ├── src/         la API
│   └── test/        pruebas de las reglas del negocio
└── frontend/    Sitio público y panel · React 19 + Vite + TypeScript
```

**Casi todo el contenido vive en la base, no en el código.** Textos, fotos, cifras, miembros de la Junta, espacios reservables, condiciones de uso y plantillas de correo se editan desde el panel y se ven en el sitio al instante. Cambiar lo que dice una página no debería requerir un despliegue.

## Requisitos

- **Node 22** — la versión la fija `.node-version` en cada carpeta, y es la misma que usan Railway y la integración continua.
- **PostgreSQL** — local, o la de Railway.

## Backend

```bash
cd backend
npm install             # corre prisma generate al terminar
cp .env.example .env    # completar con los valores reales
npm run prisma:migrate
npm run prisma:seed
npm run dev             # http://localhost:4000
```

La configuración de Prisma está en `backend/prisma.config.ts` (obligatorio desde Prisma 7): de ahí salen la conexión, las migraciones y la semilla. El cliente se conecta a través del adaptador de Postgres, creado en `src/config/db.ts` para el servidor y en `scripts/lib/prisma.mjs` para los scripts.

### Variables de entorno

Las completas, comentadas, en `backend/.env.example`.

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Firma la sesión del panel. Cualquier cadena larga y aleatoria |
| `CORS_ORIGIN` | El dominio del sitio. En desarrollo, vacía acepta cualquier `localhost` |
| `BREVO_API_KEY` | Clave del servicio de correo. Se envía por la API HTTPS de Brevo, no por SMTP: el servidor tiene bloqueada esa salida |
| `MAIL_FROM` | Remitente. Tiene que ser una dirección de un dominio verificado en Brevo |
| `CONTACT_TO_EMAIL` | A dónde llegan los avisos de los formularios. **Admite varias, separadas por coma** |
| `SITE_URL` | Dirección pública del sitio, para los enlaces que van dentro de un correo |
| `UPLOADS_DIR` | Carpeta de lo que se sube desde el panel. En Railway, un volumen montado |

Todo lo que llega por los formularios **se guarda aunque el correo falle**, y la bandeja del panel indica a quién no se pudo avisar en vez de darlo por hecho.

### Pruebas

```bash
npm test
```

Cubren las reglas que no pueden fallar: el solape de reservas y el cupo por espacio, el umbral de declaración de aportes, el orden de las listas, la limpieza de archivos y el formato de los calendarios `.ics`.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL apuntando al backend
npm run dev             # http://localhost:5173
```

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | La URL pública del backend, con `/api` al final |
| `VITE_SITE_URL` | La dirección definitiva del sitio. Mientras la página se sirva desde otra, pide a los buscadores que no la indexen |
| `SITE_URL` | La misma dirección, para el `sitemap.xml` que se genera al compilar |

> **Vite incrusta estas variables al compilar, no al arrancar.** Si se cambian en Railway, hay que volver a desplegar el frontend para que surtan efecto.

**Páginas públicas (19):** Inicio · Historia · Misión, visión y valores · Reglamento · Condiciones de uso · Junta Directiva · Personal técnico · Instalaciones · Programas y servicios · Galería · Mapa · Actividades · Reserva de espacios · Transparencia · Blog · Apóyanos · Donaciones · Contacto · Sugerencias. El `sitemap.xml` se genera solo, leyendo las rutas de `App.tsx`.

El panel vive en `/admin`, en el mismo servicio.

## Cómo se trabaja

- Todo el trabajo va a la rama **`Check`**; de ahí, un pull request a `main`.
- `main` está protegida: no entra nada que no pase la integración continua (`.github/workflows/ci.yml`), que compila, revisa y prueba las dos mitades.
- **Cada merge a `main` despliega solo** en Railway. Las migraciones de la base corren al arrancar el backend.
- Antes de empezar una tanda de cambios, poner `Check` al día con `main`.

## Despliegue (Railway)

Tres servicios dentro de un mismo proyecto: dos apuntando a este repositorio, con distinto Root Directory, y la base de datos.

Los dos servicios de código están conectados a la rama `main`. Si alguna vez aparecen desconectados (`repo: null` en `railway status --json`), se vuelven a enlazar con `railway service source connect --repo <owner>/<repo> --branch main --service <servicio>`; mientras estén sueltos, los merge no llegan a producción.

### 1. PostgreSQL
New → Database → PostgreSQL. Railway genera su propia `DATABASE_URL`.

### 2. Backend
- **Root Directory**: `backend`
- Build y start ya están en `package.json` y `railway.json`: build corre `tsc`; start corre `prisma migrate deploy` y levanta el servidor.
- `DATABASE_URL` → referenciar la del servicio de Postgres: `${{Postgres.DATABASE_URL}}`.
- `CORS_ORIGIN` y `SITE_URL` → `https://www.parquecentralsantiagord.com`.
- Healthcheck en `/api/health`.
- **Volumen para los archivos subidos**, montado en la ruta de `UPLOADS_DIR`. Sin él, las fotos y los PDF que cargue el Parque desaparecen en el siguiente despliegue.

### 3. Frontend
- **Root Directory**: `frontend`
- Build `npm run build`; start `npm run start`, que sirve `dist/` con fallback de rutas para el SPA.
- `VITE_API_URL` → la URL pública del backend, configurada **antes** del primer despliegue.

**Orden:** Postgres, luego el backend —para tener su URL—, y al final el frontend.

## Calendarios

El backend sirve las reservas en formato iCalendar (`.ics`), que entienden Google Calendar, Outlook y el iPhone, sin ninguna API externa:

- `/api/calendario/reservas.ics` — todas las aprobadas, para que el equipo se suscriba. Sin datos personales: una dirección de suscripción se comparte sin querer.
- `/api/calendario/solicitud/<clave>.ics` — una sola reserva, la que se le envía a quien la pidió al aprobarla. Va por una clave aleatoria y no por el id, y solo responde si está aprobada.

## Mantenimiento

Desde `backend/`, con `DATABASE_URL` apuntando a la base que corresponda:

| Script | Qué hace |
|---|---|
| `node scripts/respaldo.mjs [carpeta]` | Vuelca cada tabla a JSON y descarga los archivos subidos |
| `node scripts/restaurar.mjs <carpeta>` | Devuelve las tablas a la base |
| `node scripts/restaurar-uploads.mjs <carpeta>` | Devuelve los archivos al volumen. El volumen no viaja con el proyecto: al cambiar de servidor hace falta |
| `node scripts/limpiar-uploads.mjs` | Lista los archivos del volumen que ya no usa ninguna fila; con `--borrar`, los elimina |
| `node scripts/crear-admin.mjs` | Crea la primera cuenta del panel |

Los respaldos no se guardan en el repositorio.

## Documentación

Los documentos del proyecto —estado, guía del panel, sección por sección, acta de entrega— **no están en este repositorio**: el repositorio es público y esos documentos son del Parque y de ULP. Los mantiene el equipo de ULP. El `.gitignore` deja fuera cualquier documento de la raíz, incluidos los que se escriban después.

---
Equipo ULP: Junior Ureña, José Luis Alonso y Yuji Yamaki.
