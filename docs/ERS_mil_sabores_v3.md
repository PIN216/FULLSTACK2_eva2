# Especificación de Requisitos de Software (ERS)
## Proyecto: Pastelería Mil Sabores - Tienda Online Fullstack
**Norma:** Estándar IEEE 830-1998  
**Asignatura:** DSY1104 - Desarrollo Fullstack II  
**Versión del Documento:** 3.0 (Evaluación Parcial 3 - Terminada)  
**Fecha:** 12/11/2026  
**Institución:** Duoc UC - Escuela de Informática y Telecomunicaciones  

---

### Ficha del Documento y Control de Versiones

| Versión | Fecha | Autor(es) | Descripción del Cambio |
| :---: | :---: | :--- | :--- |
| **1.0** | 25/09/2026 | Equipo de Desarrollo | Levantamiento inicial de requerimientos de la pastelería, casos de uso de compra y reglas comerciales de descuento. |
| **2.0** | 28/10/2026 | Equipo de Desarrollo | Especificación del frontend en React con Bootstrap, arquitectura de componentes, persistencia en localStorage y suite de pruebas unitarias con Vitest. |
| **3.0** | 12/11/2026 | Equipo de Desarrollo | **Entrega Final ERS:** Integración de arquitectura de Backend en Spring Boot 3, base de datos relacional MySQL (`milsaboresbd`), autenticación sin estado con tokens JWT, modelo de seguridad con 3 roles (Administrador, Vendedor, Cliente), versionado de API REST y documentación en Swagger UI. |

---

## 1. Introducción

### 1.1. Propósito
El propósito del presente documento es especificar formal y exhaustivamente los requisitos funcionales y no funcionales para la versión 3.0 de la plataforma de comercio electrónico de la **Pastelería Mil Sabores**, cubriendo la integración completa del backend desarrollado en **Spring Boot 3**, la base de datos relacional **MySQL**, la seguridad basada en **Spring Security y tokens JWT**, y la interfaz SPA construida en **React**.

### 1.2. Ámbito del Sistema
El sistema proporciona una solución integral de e-commerce y gestión operativa que abarca:
- **Área Pública y Clientes:** Navegación por catálogo de tortas cuadradas, circulares, alternativas sin azúcar y certificadas sin gluten; carrito de compras dinámico con topes de stock físico; aplicación automatizada de beneficios comerciales por edad (>50 años) y código promocional (`FELICES50`); y emisión transaccional de boletas electrónicas de compra.
- **Área de Vendedor (Mostrador / Despacho):** Interfaz restringida para personal de ventas que permite consultar existencias de catálogo en tiempo real con su ficha técnica, y dar seguimiento a las órdenes de compra emitidas para preparar despachos, suprimiendo cualquier opción de modificación de precios, creación de ítems o gestión administrativa.
- **Área de Administración:** Acceso total para la gestión del catálogo mediante operaciones CRUD, mantenimiento de categorías, auditoría y asignación de roles a usuarios, y monitoreo de inventario crítico.
- **Capa de Servicios RESTful:** Endpoints versionados en `/api/v1/` con protección por JWT Bearer y documentación interactiva bajo OpenAPI 3.

### 1.3. Definiciones, Acrónimos y Abreviaturas
- **API (Application Programming Interface):** Conjunto de protocolos y endpoints que permiten la comunicación entre el frontend y el backend.
- **BCrypt:** Función de hashing criptográfico adaptativa utilizada para almacenar contraseñas seguras mediante salting y computación iterativa.
- **CORS (Cross-Origin Resource Sharing):** Mecanismo de seguridad en navegadores que permite peticiones web entre distintos orígenes (puerto 3000 de React hacia puerto 9091 de Spring Boot).
- **CRUD:** Acrónimo para las operaciones fundamentales de datos: Crear (Create), Leer (Read), Actualizar (Update) y Eliminar (Delete).
- **ERS:** Especificación de Requisitos de Software.
- **JPA / Hibernate:** Java Persistence API y su implementación ORM para mapear entidades Java con tablas relacionales en MySQL.
- **JWT (JSON Web Token):** Estándar abierto (RFC 7519) que define un mecanismo compacto y autónomo para transmitir información segura entre partes como un objeto JSON firmado digitalmente (algoritmo HMAC-SHA256).
- **SPA (Single Page Application):** Aplicación web que interactúa con el usuario reescribiendo dinámicamente la página actual en lugar de cargar páginas enteras desde el servidor.
- **Swagger / OpenAPI 3:** Especificación formal para describir, producir, consumir y visualizar servicios web RESTful interactivos.

### 1.4. Referencias
- IEEE Std 830-1998: *Recommended Practice for Software Requirements Specifications*.
- Documento Guía Evaluación Parcial N° 3 (DSY1104 Duoc UC).
- Documentos Anexo 1, Anexo 2, Anexo 3 y Anexo 4 de la Evaluación Parcial 3.
- Documentación Oficial de Spring Framework 6 y Spring Boot 3.2.x.
- Documentación Oficial de Spring Security y RFC 7519 (JSON Web Token).

### 1.5. Visión General del Documento
El documento describe en la sección 2 la perspectiva global, funciones generales y actores del sistema. La sección 3 detalla los requisitos específicos de interfaz, requerimientos funcionales prioritarios (RF-01 a RF-10) y no funcionales (RNF-01 a RNF-08), concluyendo con la matriz de trazabilidad y el modelo relacional implementado.

---

## 2. Descripción General

### 2.1. Perspectiva del Producto
Pastelería Mil Sabores es un sistema web fullstack autónomo que reemplaza los registros manuales de ventas y la persistencia temporal en navegadores por un modelo persistente cliente-servidor de alta fidelidad:
- **Base de Datos:** Motor relacional MySQL ejecutándose en el puerto 3306, con esquema `milsaboresbd`.
- **Servidor Backend:** Microservicio REST en Spring Boot escuchando en el puerto 9091.
- **Cliente Frontend:** Aplicación React en puerto 3000 comunicada mediante llamadas HTTP asíncronas (`fetch` / `axios`).

### 2.2. Funciones del Producto
1. Gestión de catálogo de pasteles con categorías y atributos comerciales (precios, existencias, fotografías y ofertas).
2. Carrito de compras con cálculo automático de promociones y restricciones de inventario (tope de existencias).
3. Procesamiento y registro persistente de boletas de compra y líneas de detalle con rebaja de stock.
4. Autenticación centralizada con BCrypt y emisión de credenciales de sesión en tokens JWT.
5. Autorización y segregación de interfaces por rol (Administrador, Vendedor, Cliente).
6. Persistencia de la sesión ante eventos de recarga de página (F5) en el navegador.
7. Exposición de documentación técnica interactiva en Swagger UI.

### 2.3. Características de los Usuarios (Roles del Sistema - Anexo 1)

| Rol | Descripción de Perfil | Permisos y Alcance en el Sistema |
| :--- | :--- | :--- |
| **Administrador** | Encargado general de operaciones y administración de la pastelería. | **Acceso Total al Sistema.** Puede realizar CRUD completo de productos y categorías, visualizar y gestionar todas las órdenes y boletas, administrar usuarios y roles, y acceder al dashboard de métricas. |
| **Vendedor** | Personal de atención en mostrador y coordinación de entregas. | **Visualización de Productos y Órdenes.** Puede visualizar la lista completa de productos y su detalle técnico; puede visualizar la lista general de órdenes emitidas y su boleta detallada. **Todos los demás accesos (creación, edición, borrado de productos, categorías, usuarios y reportes) no aparecen en su vista.** |
| **Cliente** | Consumidor que compra tortas a través de la tienda web. | **Acceso Exclusivo a la Tienda.** Puede explorar el catálogo, buscar productos, agregar al carrito, obtener beneficios comerciales por edad o cupón, y emitir su boleta de compra. No tiene acceso a paneles administrativos ni de ventas. |

### 2.4. Restricciones
- La comunicación entre el frontend y el backend debe efectuarse obligatoriamente mediante peticiones REST en formato JSON.
- Las contraseñas jamás deben almacenarse en texto plano en la base de datos ni enviarse en respuestas JSON (deben cifrarse con BCrypt y anotarse como `@JsonProperty(access = WRITE_ONLY)`).
- Todo acceso a endpoints privados debe requerir la cabecera `Authorization: Bearer <token_jwt>`.
- Las existencias de productos en bodega nunca pueden descender a valores negativos tras una compra.

---

## 3. Requisitos Específicos

### 3.1. Requisitos de Interfaces

#### 3.1.1. Interfaces de Usuario
- Interfaz web responsiva con Bootstrap 5, navegación fluida sin recargas completas (SPA).
- Barra de navegación dinámica (`Navbar.jsx`) que adapta sus botones y distintivos según el rol autenticado:
  - Sin sesión: Enlaces públicos, "Ingresar" y "Registrarse".
  - Rol Administrador: Muestra acceso a "Admin Panel" con badge rojo.
  - Rol Vendedor: Muestra acceso exclusivo a "Panel Vendedor" con badge celeste, suprimiendo opciones administrativas.
  - Rol Cliente: Muestra "Mi Perfil", "Carrito" y catálogo de la tienda.

#### 3.1.2. Interfaces de Hardware
- El backend y base de datos operan en servidores con arquitectura x86_64 o ARM con al menos 4 GB de memoria RAM.
- El cliente opera en computadores de escritorio, portátiles, tablets y smartphones mediante navegador web.

#### 3.1.3. Interfaces de Software
- **Java Virtual Machine (JVM):** Versión 17 o 21 LTS.
- **MySQL Driver:** `com.mysql.cj.jdbc.Driver` (conector oficial MySQL 8).
- **Spring Framework:** 6.1.x y Spring Boot 3.2.4.
- **Node Runtime:** Node.js 20.x o superior con React 18.

#### 3.1.4. Interfaces de Comunicación
- Protocolo HTTP/1.1 y HTTPS sobre TCP/IP.
- Cabeceras estándar: `Content-Type: application/json` y `Authorization: Bearer <token>`.
- Configuración CORS habilitada para permitir intercambios seguros entre localhost:3000 y localhost:9091.

---

### 3.2. Requisitos Funcionales (RF)

#### RF-01: Visualización y Búsqueda en el Catálogo de Productos
- **Descripción:** El sistema debe permitir a cualquier usuario (público o autenticado) consultar el listado completo de tortas y postres, filtrar por categorías y buscar por nombre sin distinción de mayúsculas/minúsculas.
- **Entradas:** Texto de búsqueda o selección de categoría.
- **Salidas:** Lista de tarjetas de producto con nombre, foto, categoría, precio y stock.
- **Criterio de Aceptación:** Búsqueda sensible a caracteres vacíos devuelve catálogo íntegro; búsquedas coincidentes filtran en tiempo real.

#### RF-02: Control de Existencias e Incorporación al Carrito
- **Descripción:** El cliente puede agregar unidades de un producto al carrito de compras siempre y cuando no sobrepase el stock disponible en bodega.
- **Entradas:** Identificador del producto y cantidad solicitada.
- **Salidas:** Carrito actualizado con cálculo de subtotal.
- **Criterio de Aceptación:** Si un producto tiene 2 unidades disponibles, el sistema bloquea cualquier intento de agregar 3 o más unidades al carrito.

#### RF-03: Cálculo Automatizado de Beneficios y Descuentos Comerciales
- **Descripción:** El backend y el frontend deben aplicar las siguientes reglas comerciales:
  1. Productos marcados con oferta aplican su descuento individual en el precio unitario.
  2. Clientes registrados con edad superior a 50 años (calculado con fecha de nacimiento) reciben el beneficio `MAYOR_50` (50% de descuento sobre el total).
  3. Clientes que registren el código `FELICES50` obtienen un 10% de descuento vitalicio.
  4. Los descuentos de cliente no se acumulan: se aplica de forma automática el de mayor porcentaje.
- **Entradas:** Carrito de compras y perfil del usuario autenticado.
- **Salidas:** Subtotal, monto de ahorro por ofertas, monto de descuento por beneficio y total neto a pagar.

#### RF-04: Emisión y Persistencia de Boletas en Base de Datos (Anexo 1 - Figura 1)
- **Descripción:** Al completar la orden en el checkout, el sistema debe registrar una boleta en la tabla `boletas` y sus ítems en `detalle_boleta`, rebajando transaccionalmente las existencias en la tabla `productos`.
- **Entradas:** Datos del cliente (nombre, correo), dirección de despacho, lista de productos, cantidades y total.
- **Salidas:** Boleta persistida con identificador único (`ORD-XXXXXX`) y fecha/hora asignada por el servidor.
- **Criterio de Aceptación:** Se genera la boleta en MySQL y las unidades compradas se descuentan inmediatamente del inventario.

#### RF-05: Autenticación Segura y Emisión de Tokens JWT (IE3.3.1 / IE3.3.4)
- **Descripción:** El backend debe validar las credenciales de los usuarios en `/api/v1/auth/login` comparando la contraseña ingresada contra el hash seguro almacenado con BCrypt. Ante credenciales correctas, debe generar y retornar un token JWT firmado digitalmente con algoritmo HS256 conteniendo el correo (subject), rol, identificador y beneficios comerciales, con expiración de 24 horas.
- **Entradas:** Correo electrónico y contraseña en texto plano.
- **Salidas:** Código HTTP 200, token JWT Bearer y datos de perfil de usuario sin contraseña.
- **Criterio de Aceptación:** Tokens manipulados o expirados son rechazados con código HTTP 401 Unauthorized.

#### RF-06: Control de Acceso y Autorización Basado en Roles (Anexo 1)
- **Descripción:** Spring Security debe aplicar restricciones a nivel de endpoint:
  - `GET /api/v1/productos/**` y `GET /api/v1/categorias/**`: Acceso público.
  - `POST /api/v1/ordenes`: Acceso público para permitir compras.
  - `GET /api/v1/ordenes/**`: Permitido exclusivamente a usuarios con rol `ADMINISTRADOR` o `VENDEDOR`.
  - Operaciones `POST`, `PUT`, `DELETE` en productos, categorías y usuarios: Permitido exclusivamente a `ADMINISTRADOR`.
- **Salidas:** Código HTTP 403 Forbidden con mensaje estructurado en JSON si el rol no tiene privilegios.

#### RF-07: Panel del Vendedor con Vistas Restringidas (Anexo 1)
- **Descripción:** El sistema debe proveer una vista especializada para el rol `VENDEDOR` que incluya únicamente:
  1. Pestaña de Catálogo de Productos y botón para ver detalle técnico.
  2. Pestaña de Lista de Órdenes emitidas y botón para ver la boleta desglosada.
  - **Restricción estricta:** Todos los demás accesos (creación, edición, eliminación de productos, gestión de categorías, usuarios y reportes financieros) quedan totalmente ocultos y deshabilitados de la vista del vendedor.
- **Criterio de Aceptación:** El vendedor puede realizar seguimiento de despachos sin poder alterar precios o productos.

#### RF-08: Panel Administrativo General (Acceso Total)
- **Descripción:** El usuario con rol `ADMINISTRADOR` debe contar con un dashboard completo con métricas de ventas, inventario y usuarios, además de formularios para crear, editar y eliminar productos y categorías, y administrar cuentas de usuario.
- **Criterio de Aceptación:** Solo usuarios con `ROLE_ADMINISTRADOR` pueden acceder a `/admin/index.html` y ejecutar modificaciones en la base de datos.

#### RF-09: Persistencia y Gestión de Sesión en Frontend (IE3.3.2 / IE3.3.5)
- **Descripción:** El frontend en React debe almacenar el token JWT y el perfil en `localStorage` (`pms_token` y `pms_session`). Al recargar la página (F5), el estado de autenticación se recupera de forma transparente manteniendo al usuario logueado en su rol. Al pulsar "Salir", se purgan todas las claves de sesión.
- **Criterio de Aceptación:** Recargar la página no cierra la sesión del usuario.

#### RF-10: Documentación Interactiva OpenAPI 3 / Swagger UI (IE3.2.1)
- **Descripción:** El backend debe exponer la documentación de la API REST en `/swagger-ui.html` generada mediante `springdoc-openapi`, detallando rutas, métodos, parámetros, modelos DTO y un botón "Authorize" para autenticarse con el token JWT.
- **Criterio de Aceptación:** Todos los endpoints son probables directamente desde la interfaz gráfica de Swagger.

---

### 3.3. Requisitos No Funcionales (RNF)

- **RNF-01 (Seguridad Criptográfica):** Las contraseñas de usuario se encriptan con BCrypt con factor de costo 10. Los tokens JWT se firman con clave de al menos 256 bits y algoritmo HMAC-SHA256. La entidad `Usuario` tiene `@JsonProperty(access = WRITE_ONLY)` para garantizar que el hash nunca viaje en las respuestas JSON.
- **RNF-02 (Rendimiento):** El tiempo de respuesta de los endpoints de lectura no debe superar los 250 ms en condiciones normales de red local.
- **RNF-03 (Disponibilidad y Contingencia):** Si el backend se detiene temporalmente, el frontend mantiene disponible el catálogo y el carrito mediante un mecanismo de contingencia local (`localStorage`), informando adecuadamente que el inicio de sesión requiere el servidor.
- **RNF-04 (Mantenibilidad y Código Limpio):** Arquitectura modular dividida en capas claras: Entidades, Repositorios (Spring Data JPA), Servicios (Lógica de Negocio), Controladores REST y Configuración de Seguridad.
- **RNF-05 (Usabilidad):** Interfaz intuitiva con feedback visual inmediato (spinners de carga, alertas de confirmación para eliminar productos del carrito y modales informativos).
- **RNF-06 (Concurrencia e Integridad):** La actualización de inventario durante el registro de órdenes se realiza bajo transaccionalidad (`@Transactional`) para evitar condiciones de carrera.

---

## 4. Matriz de Trazabilidad de Requisitos

| Requisito Funcional | Criterio de Evaluación Duoc | Componente Frontend | Componente Backend / Tabla BD |
| :--- | :--- | :--- | :--- |
| **RF-01** (Catálogo) | IE3.1.1, IE3.2.1 | `Home.jsx`, `Categorias.jsx` | `ProductoController`, `ProductoService`, tabla `productos` |
| **RF-02** (Carrito/Stock) | IE3.1.1, IE3.2.2 | `StoreContext.jsx`, `CarritoView.jsx` | Validación de existencias en `StoreContext` y backend |
| **RF-03** (Descuentos) | IE3.1.1 | `descuentoService.js` | `UsuarioController`, `AuthController` (beneficios) |
| **RF-04** (Boleta/BD) | IE3.1.1, IE3.2.2 | `CheckoutView.jsx`, `ordenService.js` | `OrdenController`, `OrdenService`, tablas `boletas` y `detalle_boleta` |
| **RF-05** (JWT Backend) | IE3.3.1, IE3.3.4 | `api.js` (header Bearer) | `JwtTokenProvider`, `JwtAuthenticationFilter`, `AuthController` |
| **RF-06** (Seguridad Roles)| IE3.3.1, IE3.3.4 | `Navbar.jsx`, control de vistas | `SecurityConfig`, `hasRole('ADMINISTRADOR')`, `hasAnyRole(...)` |
| **RF-07** (Panel Vendedor)| IE3.3.3, IE3.3.6 | `VendedorView.jsx` | `GET /api/v1/productos`, `GET /api/v1/ordenes` |
| **RF-08** (Dashboard Admin)| IE3.1.1, IE3.2.1 | `AdminDashboard.jsx`, `DashboardView.jsx` | CRUD completo en controladores Spring Boot |
| **RF-09** (Sesión F5) | IE3.3.2, IE3.3.5 | `StoreContext.jsx` (`pms_token`, `pms_session`) | Arquitectura Stateless con almacenamiento local de JWT |
| **RF-10** (Swagger UI) | IE3.2.1, IE3.2.3 | Swagger UI en navegador | `OpenApiConfig`, `springdoc-openapi-starter-webmvc-ui` |

