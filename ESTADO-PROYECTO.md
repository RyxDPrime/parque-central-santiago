# Estado del proyecto

**Parque Central de Santiago** · Documento para el equipo administrativo
Ureña Limited Partners · 8 de septiembre de 2026

Qué está construido y en línea, qué falta para cerrar la fase actual, y de quién depende cada
cosa pendiente.

> Sustituye a la versión del 3 de septiembre. Desde entonces se conectó el dominio del Parque,
> se ocultaron secciones a la espera de decisiones, y el sitio pasó a desplegarse solo con cada
> cambio aprobado.

---

## 1. Dónde estamos

Las diez secciones que la propuesta original definió para la Fase 1 están construidas. Además
hay **seis páginas y un panel administrativo completo** que no estaban contemplados, y tres
funcionalidades que en la propuesta figuraban como Fase 2 y ya están hechas: reservas,
donaciones y gestión de usuarios.

**Lo que falta para cerrar no es desarrollo.** Es contenido que el Parque todavía no ha
enviado, decisiones que solo el Parque puede tomar, y dos trámites externos.

| Frente | Estado |
|---|---|
| Secciones de la propuesta original | Las 10, construidas |
| Entregado además de lo pedido | 6 páginas y un panel de 22 pantallas |
| Dominio propio | Conectado, **apagado a la espera de la revisión** |
| Reservas de espacios | Construido, **en preparación** hasta confirmar las listas |
| Donaciones | Funcionando, a falta de las cuentas bancarias |
| Usuarios y roles | Funcionando, con una sola cuenta creada |
| Correo saliente | Funcionando. Ya llega al correo institucional; falta que salga desde él |
| Pago con tarjeta | Bloqueado por la afiliación con la pasarela |

---

## 2. El dominio

**`www.parquecentralsantiagord.com` ya sirve el sitio.** Está conectado y responde.

Ahora mismo está **deliberadamente sin datos**: se dejó así mientras el equipo del Parque
revisa qué secciones deben verse en el lanzamiento y cuáles conviene esconder todavía. La
página carga pero no muestra contenido, y **eso se enciende con un solo cambio de
configuración** en cuanto la decisión esté tomada.

Quedan tres cosas por hacer el mismo día que se encienda, y las hacemos nosotros:

1. **Autorizar el dominio** para que la página pueda leer sus propios datos.
2. **Redirigir la dirección sin `www`**, que hoy lleva a la página anterior del Parque, alojada
   en otro servidor.
3. **Permitir que Google lo indexe.** Mientras el sitio se sirva desde una dirección distinta
   de la definitiva, pide a los buscadores que no lo guarden — para que no queden dos copias
   compitiendo. Con el dominio conectado, eso se invierte.

> **La dirección con «www» y sin «www» no son la misma cosa para un navegador.**
> Hay que decidir cuál es la oficial. Recomendamos publicar y comunicar siempre la misma, y que
> la otra redirija a ella.

---

## 3. Qué hay construido

### 3.1 El sitio público

Dieciocho páginas. El detalle de cada una está en el documento *"El sitio web, sección por
sección"*.

| Bloque | Páginas |
|---|---|
| Portada | Inicio |
| El Parque | Historia · Misión, visión y valores · Junta Directiva · Personal técnico · Reglamento |
| Qué hay | Instalaciones y servicios · Programas · Galería · Mapa · Actividades |
| Gestiones | Reserva de espacios · Donaciones · Apóyanos |
| Institucional | Transparencia · Blog |
| Contacto | Contacto · Sugerencias |

**Dos secciones están en preparación por decisión del equipo**, no por falta de trabajo:

- **Reserva de espacios.** La página está construida entera —formulario, calendario de lo ya
  apartado, correos de respuesta— y hoy muestra un aviso de que la sección estará disponible
  pronto. Se publica el día que el Parque confirme los tipos de actividad y qué espacios se
  cobran. Volver a mostrarla es un cambio de una línea.
- **Uso de donaciones** y **Código de ética**, dentro de Transparencia. Sus textos siguen
  guardados y editables en el panel; solo dejaron de mostrarse.

### 3.2 El panel administrativo

Veintidós secciones con tabla, repartidas en siete grupos, más los textos sueltos y las fotos
de encabezado. El equipo del Parque cambia desde ahí prácticamente todo lo que se ve, sin tocar
código ni depender de nosotros. Cómo se usa está en la *Guía del panel administrativo*.

### 3.3 Lo que el Parque recibe

Cuatro formularios con su bandeja en el panel: contacto, sugerencias, solicitudes de reserva y
aportes. **Todo lo que llega se guarda aunque el correo falle**, y la bandeja avisa cuando a
alguien no se le pudo escribir, en vez de darlo por hecho.

---

## 4. Contenido cargado hoy

| Sección | Registros |
|---|---|
| Instalaciones | 20 |
| Junta Directiva | 19 |
| Aliados y patrocinadores | 19 |
| Fotos de encabezado | 19 |
| Galería | 15 |
| Hitos de la historia | 14 |
| Actividades | 13 |
| Tipos de actividad | 13 |
| Espacios reservables | 12 |
| Normas del reglamento | 12 |
| Valores institucionales | 8 |
| Puntos del mapa | 8 |
| Personal técnico | 6 |
| Programas y servicios | 6 |
| Cifras del inicio | 5 |
| Plantillas de correo | 4 |
| Formas de aportar | 3 |
| Pasos de reserva | 3 |
| Documentos financieros | 2 |
| Formas de apoyo | 2 |
| Usuarios del panel | 1 |
| **Publicaciones del blog** | **0** |
| **Cuentas bancarias** | **0** |

Además, 37 textos sueltos en 9 grupos.

---

## 5. Lo que falta, por responsable

### 5.1 Del Parque — contenido y decisiones

| Qué | Por qué importa | Urgencia |
|---|---|---|
| **Cargar las cuentas bancarias** | Sin ellas, Donaciones no ofrece ninguna forma de dar dinero. Se resuelve en cinco minutos desde el panel | **Alta** |
| **Confirmar los tipos de actividad permitidos** | La lista de 13 es un borrador nuestro, y es lo que decide qué se puede solicitar. Es una de las dos cosas que mantienen Reserva sin publicar | **Alta** |
| **Confirmar cuáles espacios se cobran** | Los 12 están marcados con costo por suposición nuestra. Es la otra | **Alta** |
| **Revisar con su asesor legal el umbral y los motivos de rechazo** | Desde qué monto hay que identificar a quien aporta (hoy RD$ 25,000) y qué motivos de rechazo son válidos. Ambos son borrador nuestro | **Alta** |
| **Decidir qué se publica el día del lanzamiento** | Es lo único que mantiene el dominio apagado | **Alta** |
| **El blog quedó vacío** | La sección está en el menú y hoy no tiene ninguna publicación. O se carga algo, o conviene esconderla como se hizo con Reserva | **Alta** |
| **Las cifras del inicio** | El Parque adelantó que quiere reemplazar las cinco actuales. Hacen falta las definitivas | Media |
| **Crear las cuentas del equipo** | Hoy existe una sola, compartida. Con cuentas propias queda registro de quién cambió qué | Media |
| Fotografías pendientes | 7 instalaciones, 4 programas, 4 encabezados, 2 del personal técnico y 2 logos de aliados | Media |
| Reescribir los pasos de reserva | Dicen que hay que llamar; describen el proceso anterior al formulario | Media |
| Los nombres de los dos diputados | Sus tarjetas dicen "Representante por designar", y son las dos únicas sin imagen | Media |
| Más documentos en Transparencia | Hay dos. Es poco para una sección que existe para mostrar apertura | Baja |

### 5.2 Bloqueado por trámites

**Correo desde una cuenta del Parque.** Los mensajes del sitio **ya llegan** a
`info@parquecentralsantiagord.com`: ese cambio está hecho y comprobado. Lo que falta es lo
inverso — que los correos **salgan** desde esa dirección y no desde la cuenta personal del
equipo de desarrollo.

Para eso hay que verificar el dominio con el proveedor de envío, añadiendo unos registros al
DNS. Es un trámite con espera de propagación, así que conviene arrancarlo antes del
lanzamiento y no el mismo día.

> **El remitente no se cambia antes de esa verificación.** El proveedor solo acepta enviar
> desde dominios verificados con él: cambiarlo antes no empeora los correos, los rechaza
> todos. Y el primero en notarlo es quien pidió una reserva y se queda esperando una
> respuesta que el Parque cree haber enviado. Ver *"El correo del sitio"*.

**Pago con tarjeta.** Requiere afiliación con AZUL o equivalente. La forma de pago se retiró de
la lista mientras tanto; el día que exista la afiliación se vuelve a agregar desde el panel.
Ver *"Cómo recibir donaciones en línea"*.

### 5.3 De nuestra parte

- Integrar la pasarela de pago, cuando la afiliación esté.
- Conectar el dominio del todo, en cuanto el Parque decida qué se publica.
- **Respaldo automático de la base de datos.** Hoy existe el procedimiento y funciona, pero hay
  que acordarse de ejecutarlo. Todo el contenido de la tabla del punto 4 es trabajo manual de
  semanas.

---

## 6. Lo que mejoró desde la versión anterior

No cambia lo que el Parque ve, pero sí lo que puede pasar. Se resume aquí porque son las cosas
que, cuando fallan, se notan tarde y mal.

**Dar de baja a alguien ahora surte efecto de inmediato.** Antes, una cuenta cerrada conservaba
sus permisos hasta una semana. Importa ahora que están por crearse las cuentas del equipo.

**Nada llega al sitio sin comprobarse.** Cada cambio pasa por una revisión automática antes de
publicarse, y el sitio se despliega solo cuando esa revisión da verde. Hay además una batería
de pruebas sobre las reglas que deciden cosas: los horarios que se pisan, el umbral de
identificación, el orden de las listas.

**No se pueden aprobar dos reservas para el mismo espacio a la misma hora.** El sistema avisa
antes, mostrando con cuál choca, y deja seguir solo si se confirma. Antes el choque aparecía el
día de la actividad.

**Los recuadros de los formularios y las tarjetas ahora se ven.** Estaban dibujados con un
contraste por debajo del mínimo que pide la norma de accesibilidad, y en varias pantallas no se
distinguían del fondo.

**El servidor se actualizó a una versión con soporte.** La anterior llevaba más de un año sin
recibir parches de seguridad.

---

## 7. Riesgos que conviene tener presentes

**Todo el modelo de reservas y donaciones se sostiene sobre el correo.** Quien solicita no sabe
si tiene el espacio hasta que le llega la respuesta. El envío funciona y está verificado, y lo
que llega ya entra por el correo institucional; lo que sale todavía sale desde una cuenta
personal, y moverlo a la del Parque es lo que le da respaldo institucional.

**Las listas sembradas se aplican de verdad.** Los tipos de actividad, los motivos de rechazo y
el umbral de identificación no son adorno: el sistema los usa para permitir o impedir cosas.
Mientras sean borrador nuestro, el sitio está aplicando criterios que el Parque no ha
confirmado.

**Una sola cuenta de acceso.** Si varias personas van a cargar contenido, conviene crear sus
cuentas antes de empezar, no después: es lo que permite saber quién hizo qué.

**El dominio y el alojamiento deben quedar a nombre del Parque.** El dominio ya lo está. La
cuenta donde hoy corre el sitio es del equipo de desarrollo, y conviene transferirla antes de
la entrega.

---

## 8. Los documentos del proyecto

| Documento | Para qué | Estado |
|---|---|---|
| **Estado del proyecto** | Este. Qué hay, qué falta y de quién depende | Vigente |
| **Información pendiente** | La lista corta de lo que falta enviar, medida sobre el sitio | Vigente |
| **El sitio web, sección por sección** | Qué contiene cada página y desde dónde se administra | Vigente |
| **Guía del panel administrativo** | Cómo se usa el panel, pantalla por pantalla | Vigente |
| **Cómo recibir donaciones en línea** | Pasarela de pago frente a transferencia: ventajas, costos y recomendación | Vigente |
| **El correo del sitio** | Qué parte del correo ya es institucional, qué falta y en qué orden hacerlo | Vigente |
