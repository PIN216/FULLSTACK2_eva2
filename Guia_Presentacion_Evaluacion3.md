# Guía y Guion de Presentación - Evaluación Parcial N° 3

**Asignatura:** DSY1104 - Desarrollo Fullstack II  
**Instancia:** Situación Evaluativa 2 - Presentación Oral y Defensa Técnica Individual (60% de la Evaluación 3)  
**Proyecto:** Pastelería Mil Sabores  
**Duración:** 15 minutos de exposición + 5 minutos de ronda de preguntas abiertas del docente  
**Ponderación:** 40% de la asignatura (Situación 1: 40% encargo, Situación 2: 60% presentación)  

---

## 1. Estructura y Distribución del Tiempo (15 Minutos)

| Bloque | Minutos | Indicador Evaluado | Contenido Clave a Exponer |
| :---: | :---: | :--- | :--- |
| **Bloque 1** | 00:00 - 02:30 | **IE3.1.2** (Backend, Base de Datos y Lógica) | Arquitectura Spring Boot, conexión MySQL, entidades JPA del modelo relacional (`USUARIO` - `BOLETA` - `DETALLE_BOLETA` - `PRODUCTO` - `CATEGORIA`), y reglas de negocio de descuentos e inventario. |
| **Bloque 2** | 02:30 - 05:00 | **IE3.2.3** (API REST CRUD y Swagger) | Endpoints REST versionados en `/api/v1/`, códigos de estado HTTP, operaciones CRUD completas y documentación interactiva en OpenAPI 3 / Swagger UI. |
| **Bloque 3** | 05:00 - 07:30 | **IE3.2.4** (Integración REST Backend-Frontend) | Cliente HTTP con inyección automática de cabeceras, sincronización de estado, cálculo de descuentos y flujo bidireccional eficiente sin recarga. |
| **Bloque 4** | 07:30 - 10:00 | **IE3.3.4** (Autenticación JWT y Roles en Backend) | Arquitectura Stateless con Spring Security, generación y firma criptográfica de tokens JWT (HS256), expiración a 24 horas y segregación en 3 roles (ADMINISTRADOR, VENDEDOR, CLIENTE). |
| **Bloque 5** | 10:00 - 12:30 | **IE3.3.5** (Gestión y Persistencia de Sesión Frontend) | Estado global con `StoreContext`, persistencia transparente de credenciales ante recargas de página (F5) en `localStorage` y destrucción segura al cerrar sesión. |
| **Bloque 6** | 12:30 - 15:00 | **IE3.3.6** (Restricciones de Acceso en Frontend) | Demostración visual de perfiles: Panel Vendedor con solo catálogo y órdenes sin botones de edición/creación; protección de rutas ante accesos no autorizados (HTTP 403). |
| **Cierre** | 15:00 - 20:00 | **Ronda de Preguntas** | Defensa técnica individual respondiendo preguntas abiertas formuladas por el docente sobre el código y GitHub. |

---

## 2. Guion Detallado por Indicador (Nivel 100% - Muy Buen Desempeño)

### Tema 1 (IE3.1.2): Backend, Conexión a Base de Datos y Lógica de Negocio
> **Objetivo:** *Describe de manera ejemplar el desarrollo de una aplicación backend conectada a una base de datos, implementando lógica de negocio y modelos de datos perfectos.*

**Qué decir en la presentación:**
> "Para esta tercera evaluación, desarrollamos un backend robusto basado en **Spring Boot 3.2.4**, conectado a una base de datos relacional **MySQL 8** llamada `milsaboresbd`. Implementamos una arquitectura en capas: Controladores REST, Servicios transaccionales y Repositorios con Spring Data JPA.  
> Diseñamos el modelo de datos respetando con total exactitud la **Figura 1 del Anexo 1**:  
> `USUARIO` se relaciona con `BOLETA` en relación de uno a muchos; `BOLETA` contiene múltiples `DETALLE_BOLETA` mediante colección embebida con clave foránea; cada detalle se vincula con un `PRODUCTO`, y los productos se organizan en familias de `CATEGORIA`.  
> En cuanto a la **lógica de negocio**, garantizamos dos pilares fundamentales:  
> Primero, la **integridad de inventario**: al emitir una orden en el servicio `@Transactional`, el backend descuenta en tiempo real las existencias físicas de cada torta comprada, asegurando que el stock nunca sea negativo.  
> Segundo, la **evaluación automática de descuentos**: al registrar un cliente, el backend calcula a partir de su fecha de nacimiento si tiene más de 50 años para asignarle el beneficio vitalicio `MAYOR_50` (50% de rebaja), o valida el cupón `FELICES50` (10% de rebaja), aplicando siempre el de mayor conveniencia comercial sin acumulación duplicada."

---

### Tema 2 (IE3.2.3): Servicios API REST con Spring Boot, CRUD y Swagger UI
> **Objetivo:** *Explica de manera ejemplar cómo se implementaron servicios de API REST utilizando Spring Boot, con endpoints perfectamente funcionales para operaciones CRUD y documentados en Swagger.*

**Qué decir en la presentación:**
> "Estructuramos la API siguiendo las mejores prácticas de la industria y las directrices del encargo, incorporando un **versionado formal en las rutas bajo `/api/v1/`**, manteniendo además retrocompatibilidad con las rutas base.  
> Los servicios cubren las cuatro operaciones CRUD completas:  
> - En **Productos**: `GET` para listar catálogo o consultar por ID (público), `POST` para dar de alta nuevas tortas con validación de precios y existencias positivas, `PUT` para actualizar características y porcentajes de oferta, y `DELETE` para dar de baja productos.  
> - En **Categorías**: operaciones para organizar las familias de productos.  
> - En **Órdenes y Boletas**: `POST` para generar comprobantes tributarios tras el pago y `GET` para auditoría y despacho.  
> Toda la API se encuentra documentada interactivamente mediante **OpenAPI 3 y Swagger UI**, accesible en `http://localhost:9091/swagger-ui.html`. Integramos la anotación `@SecurityScheme` con formato Bearer JWT, lo que permite al docente o evaluador ingresar su token con el botón 'Authorize' y probar interactivamente las respuestas exitosas (200, 201) y los códigos de error estandarizados (400 Bad Request, 401 Unauthorized, 403 Forbidden y 404 Not Found)."

---

### Tema 3 (IE3.2.4): Integración Efectiva Backend-Frontend y Flujo de Datos
> **Objetivo:** *Justifica de manera convincente la integración efectiva entre servicios de backend y frontend mediante la comunicación de la API REST, con un análisis exhaustivo del flujo de datos.*

**Qué decir en la presentación:**
> "La integración entre la aplicación cliente en React y el backend Spring Boot opera de forma desacoplada y asíncrona mediante un cliente centralizado en `frontend/src/services/api.js`.  
> El flujo de datos inicia en la interfaz de usuario: ante una acción (por ejemplo, buscar un pastel o confirmar una compra), el componente despacha la llamada hacia la capa de servicios (`ProductoService`, `OrdenService`, `UsuarioService`).  
> Nuestro cliente HTTP intercepta cada solicitud para evaluar si existe una sesión activa: de ser así, inyecta automáticamente el encabezado HTTP estándar `Authorization: Bearer <token_jwt>`.  
> El servidor procesa la petición en microsegundos y retorna una respuesta JSON estructurada con su respectivo código de estado. Para garantizar una experiencia de usuario óptima y resiliente, implementamos un **mecanismo de contingencia local** en el frontend: si el servidor sufriera una interrupción de red momentánea, la tienda mantiene disponible el catálogo y el carrito mediante copias sincronizadas, avisando amigablemente cuando se requiere el servidor para autenticarse."

---

### Tema 4 (IE3.3.4): Autenticación con Roles y Tokens JWT en Backend
> **Objetivo:** *Describe de manera ejemplar la implementación de autenticación de usuarios utilizando roles y autenticación basada en tokens (JWT), asegurando un acceso seguro a los recursos.*

**Qué decir en la presentación:**
> "Para cumplir con los más altos estándares de seguridad (IE3.3.4), implementamos una arquitectura **Stateless (sin estado)** con **Spring Security 6 y la librería JJWT 0.12**.  
> El proceso se articula en tres etapas criptográficas:  
> 1. **Almacenamiento seguro:** Las contraseñas nunca se guardan en texto plano; se utiliza **BCrypt con salting**, y el atributo está protegido con `@JsonProperty(access = WRITE_ONLY)` para evitar cualquier fuga en los payloads de respuesta.  
> 2. **Generación del Token:** Cuando el usuario envía sus credenciales a `/api/v1/auth/login`, el método `JwtTokenProvider.generarToken()` construye un token firmado digitalmente con clave secreta HS256 de 256 bits y vigencia de 24 horas, incluyendo claims con el ID, nombre, correo, rol y lista de beneficios. Implementamos además el endpoint `/api/v1/auth/refresh` para renovar tokens válidos de forma segura.  
> 3. **Filtro de Intercepción:** Mediante `JwtAuthenticationFilter`, cada petición entrante es analizada: se valida la firma y expiración del token Bearer, se extrae el rol y se establece un `UsernamePasswordAuthenticationToken` en el `SecurityContextHolder`.  
> Con esto, aseguramos en `SecurityConfig` los **tres roles del Anexo 1**:  
> - `ROLE_ADMINISTRADOR`: Acceso total para modificar catálogo, categorías, usuarios y reportes.  
> - `ROLE_VENDEDOR`: Permiso exclusivo para consultar productos y órdenes de compra.  
> - `ROLE_CLIENTE`: Acceso a la tienda, catálogo y generación de órdenes de compra."

---

### Tema 5 (IE3.3.5): Gestión y Persistencia de Sesión en el Frontend
> **Objetivo:** *Expone correctamente el desarrollo de un sistema de gestión de sesiones en el frontend, asegurando la persistencia y seguridad de la sesión incluso en caso de recargas de página.*

**Qué decir en la presentación:**
> "En el frontend React, centralizamos el estado de la sesión mediante la Context API en `StoreContext.jsx`.  
> Un desafío habitual en aplicaciones SPA es que al presionar **F5 o recargar la página**, las variables de memoria de JavaScript se destruyen. Para resolverlo con máxima seguridad y persistencia (IE3.3.5):  
> - Al recibir la respuesta del login, almacenamos el token JWT bajo la clave `pms_token` y el perfil sanitizado del usuario bajo `pms_session` en `localStorage`.  
> - La inicialización del estado en `useState` se realiza de manera diferida mediante funciones de lectura que comprueban inmediatamente si existen credenciales válidas en el almacenamiento del navegador.  
> - De esta forma, si el cliente, vendedor o administrador recarga la página, el contexto restaura su identidad al instante sin requerir que vuelva a escribir sus credenciales.  
> - Al hacer clic en el botón **'Salir'**, ejecutamos una rutina de limpieza exhaustiva que elimina ambas claves locales (`pms_token` y `pms_session`), restablece el estado en memoria y devuelve al usuario de forma segura a la vista inicial de la tienda."

---

### Tema 6 (IE3.3.6): Restricciones de Acceso a Funcionalidades en Frontend
> **Objetivo:** *Explica de manera ejemplar cómo se desarrollaron restricciones de acceso a funcionalidades en el frontend, asegurando que solo usuarios autorizados accedan a interfaces y acciones específicas.*

**Qué decir en la presentación:**
> "Para cumplir con el **Anexo 1**, diseñamos un esquema de control de acceso por roles en el frontend que garantiza una segregación estricta de interfaces:  
> - **Para el Vendedor:** Diseñamos el componente `VendedorView.jsx`. Al iniciar sesión como vendedor, la barra de navegación oculta el enlace de 'Admin Panel' y muestra 'Panel Vendedor'. En esta vista, el vendedor puede ver el catálogo con existencias y las órdenes recibidas para coordinar entregas, pero **todos los demás accesos quedan totalmente omitidos**: no existen botones para crear tortas, editar precios, eliminar productos, ni paneles de usuarios o finanzas.  
> - **Para el Administrador:** Cuenta con el dashboard integral (`AdminDashboard.jsx` y `DashboardView.jsx`) con control operativo total y reportes.  
> - **Para el Cliente e Invitado:** Solo pueden interactuar con el catálogo comercial, su carrito y proceso de pago.  
> Si un usuario sin privilegios intenta escribir manualmente una ruta restringida o burlar la interfaz, el sistema evalúa su rol en `StoreContext` y despliega la pantalla de advertencia **HTTP 403 - Acceso Restringido** (evidenciada en la Figura 7 de nuestro manual), bloqueando el acceso de inmediato."

---

## 3. Banco de Preguntas Abiertas del Docente (Defensa Técnica Individual)

A continuación se detallan las preguntas técnicas más probables formuladas por el evaluador durante los 5 minutos finales, junto con la respuesta argumentada:

### Pregunta 1: *"¿Por qué decidieron utilizar una autenticación basada en tokens JWT en lugar de sesiones tradicionales con cookies o HttpSession?"*
- **Respuesta:**  
  *"Optamos por JWT porque proporciona una arquitectura totalmente **sin estado (Stateless)**, lo cual es el principio fundamental de una API RESTful escalable. Con sesiones tradicionales de `HttpSession`, el servidor Spring Boot tendría que reservar memoria para almacenar el identificador de sesión de cada usuario conectado, lo que complica el escalamiento horizontal y genera problemas de CORS entre orígenes distintos (puerto 3000 de React y puerto 9091 de Spring Boot). Con JWT, el token viaja en cada solicitud HTTP como portador de identidad firmado digitalmente; el backend únicamente verifica la firma matemática con su clave secreta sin consultar memoria de sesión, haciendo la comunicación sumamente rápida, ligera y segura."*

### Pregunta 2: *"¿Cómo garantizan que un vendedor no pueda modificar el precio de una torta interceptando una petición desde Postman o la consola del navegador?"*
- **Respuesta:**  
  *"Aplicamos el principio de **seguridad en profundidad (Defense in Depth)**. Las restricciones no existen solamente a nivel visual en el frontend React, sino que están estrictamente blindadas en el backend con Spring Security. En `SecurityConfig`, configuramos la regla `.requestMatchers(HttpMethod.PUT, "/api/v1/productos/**").hasRole("ADMINISTRADOR")`. Aunque un vendedor copie su token JWT e intente enviar un `PUT` manual desde Postman o Fetch hacia la API, el filtro `JwtAuthenticationFilter` extraerá su rol (`ROLE_VENDEDOR`) y Spring Security rechazará la petición de inmediato con un código `HTTP 403 Forbidden` antes de que alcance el controlador o la base de datos."*

### Pregunta 3: *"¿Cómo evitaron que las contraseñas se expongan en las respuestas JSON o que un atacante las lea en la base de datos?"*
- **Respuesta:**  
  *"Implementamos dos capas de protección en la entidad `Usuario`: primero, al recibir la contraseña en el registro o creación, la encriptamos mediante `PasswordEncoder.encode()` utilizando el algoritmo de derivación de claves **BCrypt con salting**, impidiendo ataques por tablas de arcoíris. Segundo, marcamos el atributo en la clase Java con la anotación `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)`. Gracias a esto, Jackson deserializa la contraseña cuando entra en el cuerpo de la petición, pero la omite automáticamente al serializar las respuestas JSON, garantizando que nunca se transmita hacia el cliente ni quede visible en las herramientas de red del navegador."*

### Pregunta 4: *"¿Cómo resolvieron la concurrencia y la prevención de sobre-venta de productos cuando dos clientes compran al mismo tiempo?"*
- **Respuesta:**  
  *"Lo gestionamos a nivel de lógica de negocio y transaccionalidad. En el frontend, el método `addToCart` verifica el tope de stock físico antes de permitir agregar unidades al carrito. En el backend, el método `registrarOrden()` en `OrdenService` está anotado con `@Transactional`. Al procesar la compra en MySQL, el backend descuenta las unidades dentro de la misma transacción de persistencia de la boleta. Si el stock no fuera suficiente, la transacción se aborta asegurando la consistencia ácida de los datos."*

### Pregunta 5: *"¿Qué cambios realizaron en el repositorio Git y cómo distribuyeron las tareas durante el desarrollo de esta evaluación?"*
- **Respuesta:**  
  *"El desarrollo en GitHub se organizó de manera modular mediante ramas de trabajo y commits descriptivos y atómicos:  
  1. Rama de configuración y modelo relacional: creación de dependencias en `pom.xml`, entidades JPA (`Usuario`, `Boleta`, `DetalleBoleta`, `Producto`, `Categoria`) y conexión a MySQL.  
  2. Rama de seguridad: desarrollo del proveedor de tokens JWT, filtro `JwtAuthenticationFilter`, configuración de Spring Security y endpoints `/api/v1/auth/**`.  
  3. Rama de integración frontend: actualización de `api.js` para inyectar cabeceras Bearer, creación del panel especializado del vendedor (`VendedorView.jsx`), gestión de sesiones en `StoreContext` y desarrollo de las pruebas unitarias con Vitest aprobadas al 100%."*

