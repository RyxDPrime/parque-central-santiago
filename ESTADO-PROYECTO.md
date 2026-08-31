# Estado del proyecto

**Parque Central de Santiago** · Documento para el equipo administrativo
Ureña Limited Partners · Septiembre de 2026

Qué está construido y en línea, qué falta para cerrar la fase actual, y de quién depende cada cosa pendiente.

> Sustituye a la versión de agosto. Aquella se escribió antes de que existieran las reservas, las donaciones y las cuentas de usuario, y hoy describe menos de la mitad del sitio.

---

## 1. Dónde estamos

Las diez secciones que la propuesta original definió para la Fase 1 están construidas y publicadas. Además hay **seis páginas y un panel administrativo completo** que no estaban contemplados, y tres funcionalidades que en la propuesta figuraban como Fase 2 y ya están hechas: reservas, donaciones y gestión de usuarios.

**Lo que falta para cerrar no es desarrollo.** Es contenido que el Parque todavía no ha enviado, decisiones que solo el Parque puede tomar, y dos trámites externos.

| Frente | Estado |
|---|---|
| Secciones de la propuesta original | Las 10, construidas y publicadas |
| Entregado además de lo pedido | 6 páginas y un panel de 22 pantallas |
| Reservas de espacios | Funcionando, a falta de confirmar listas |
| Donaciones | Funcionando, a falta de las cuentas bancarias |
| Usuarios y roles | Funcionando, con una sola cuenta creada |
| Correo saliente | Funcionando, pero desde una cuenta personal |
| Pago con tarjeta | Bloqueado por la afiliación con la pasarela |
| Dominio propio | Pendiente por decisión del equipo de desarrollo |

---

## 2. Qué hay construido

### 2.1 El sitio público

Dieciocho páginas. El detalle de cada una está en el documento *"El sitio web, sección por sección"*.

| Bloque | Páginas |
|---|---|
| Portada | Inicio |
| El Parque | Historia · Misión, visión y valores · Junta Directiva · Personal técnico · Reglamento |
| Qué hay | Instalaciones y servicios · Programas · Galería · Mapa · Actividades |
| Gestiones | Reserva de espacios · Donaciones · Apóyanos |
| Institucional | Transparencia · Blog |
| Contacto | Contacto · Sugerencias |

### 2.2 El panel administrativo

Veintidós secciones con tabla, repartidas en siete grupos, más los textos sueltos y las fotos de encabezado. El equipo del Parque cambia desde ahí prácticamente todo lo que se ve, sin tocar código ni depender de nosotros.

### 2.3 Lo que el Parque recibe

Cuatro formularios con su bandeja en el panel: contacto, sugerencias, solicitudes de reserva y aportes. Todo lo que llega se guarda aunque el correo falle.

---

## 3. Contenido cargado hoy

| Sección | Registros |
|---|---|
| Instalaciones | 20 |
| Junta Directiva | 19 |
| Aliados y patrocinadores | 19 |
| Galería | 15 |
| Hitos de la historia | 14 |
| Actividades | 13 |
| Tipos de actividad | 13 |
| Espacios reservables | 12 |
| Normas del reglamento | 12 |
| Valores institucionales | 8 |
| Motivos de rechazo de aportes | 8 |
| Puntos del mapa | 8 |
| Personal técnico | 6 |
| Programas y servicios | 6 |
| Cifras del inicio | 5 |
| Formas de aportar | 4 |
| Plantillas de correo | 4 |
| Pasos de reserva | 3 |
| Documentos financieros | 2 |
| Formas de apoyo | 2 |
| Publicaciones del blog | 1 |
| Usuarios del panel | 1 |
| **Cuentas bancarias** | **0** |

Además, 37 textos sueltos en 9 grupos y 19 fotos de encabezado.

---

## 4. Lo que falta, por responsable

### 4.1 Del Parque — contenido y decisiones

| Qué | Por qué importa | Urgencia |
|---|---|---|
| **Cargar las cuentas bancarias** | Sin ellas, la página de Donaciones no ofrece ninguna forma de dar dinero. Se resuelve en cinco minutos desde el panel | **Alta** |
| **Confirmar los tipos de actividad permitidos** | La lista de 13 es un borrador nuestro, y el sistema ya la aplica: lo que no está en ella no se puede solicitar | **Alta** |
| **Confirmar cuáles espacios se cobran** | Los 12 están marcados con costo por suposición nuestra | **Alta** |
| **Revisar con su asesor legal el umbral y los motivos de rechazo** | Desde qué monto hay que identificar a quien aporta (hoy RD$ 25,000) y qué motivos de rechazo son válidos. Ambos son borrador nuestro | **Alta** |
| **Crear las cuentas del equipo** | Hoy existe una sola, compartida. Con cuentas propias queda registro de quién cambió qué | Media |
| Fotografías pendientes | Canchas, kioscos, entrada, inauguración, vista aérea y las instalaciones nuevas | Media |
| Reescribir los pasos de reserva | Dicen que hay que llamar; describen el proceso anterior al formulario | Media |
| Revisar el hito de 2018 | Dice "Constitución del Patronato" y el sitio ya afirma que existe desde 2001 | Media |
| Los nombres de los dos diputados | Sus tarjetas dicen "Representante por designar" | Media |
| Publicar qué actividades no se permiten, en el Reglamento | Hoy esa regla no está escrita en ninguna de las 12 normas | Media |
| Contenido para el blog | Hay una sola publicación | Baja |

### 4.2 Bloqueado por trámites

- **Correo desde una cuenta del Parque.** Hoy el sitio manda correo desde una cuenta personal del equipo de desarrollo. Funciona, pero no tiene respaldo institucional. Ver el documento *"El correo del sitio"*.
- **Pago con tarjeta.** Requiere afiliación con AZUL o equivalente. Ver el documento *"Cómo recibir donaciones en línea"*.
- **Dominio propio.** Por decisión del equipo de desarrollo no se conecta hasta terminar la fase de desarrollo.

### 4.3 De nuestra parte

- Integrar la pasarela de pago, cuando la afiliación esté.
- Respaldo automático de la base de datos. Hoy existe el procedimiento, pero se ejecuta a mano.

---

## 5. Riesgos que conviene tener presentes

**Todo el modelo de reservas y donaciones se sostiene sobre el correo.** Quien solicita no sabe si tiene el espacio hasta que le llega la respuesta. El envío está funcionando y verificado, pero sale desde una cuenta personal: moverlo a una del Parque es lo que le da respaldo institucional.

**Las listas sembradas ya se aplican de verdad.** Los tipos de actividad, los motivos de rechazo y el umbral de identificación no son adorno: el sistema los usa para permitir o impedir cosas. Mientras sean borrador nuestro, el sitio está aplicando criterios que el Parque no ha confirmado.

**Una sola cuenta de acceso.** Si varias personas van a cargar contenido, conviene crear sus cuentas antes de empezar, no después: es lo que permite saber quién hizo qué.

---

## 6. Los documentos del proyecto

| Documento | Para qué | Estado |
|---|---|---|
| **Estado del proyecto** | Este. Qué hay, qué falta y de quién depende | Vigente |
| **El sitio web, sección por sección** | Qué contiene cada página y desde dónde se administra | Vigente |
| **Guía del panel administrativo** | Cómo se usa el panel, pantalla por pantalla | Vigente |
| **Cómo recibir donaciones en línea** | Pasarela de pago frente a transferencia: ventajas, costos y recomendación | Vigente |
| **El correo del sitio** | Por qué el correo sale desde una cuenta personal y cómo corregirlo | Vigente |
| *Reserva de espacios y donaciones en línea* (agosto) | Proponía ambas funcionalidades | **Sustituido**: ya están construidas |
| *Clave de aplicación para el correo* (agosto) | Pedía una clave de Gmail para SMTP | **Sustituido**: SMTP está bloqueado en el servidor |
