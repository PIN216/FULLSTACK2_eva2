# Matriz de Documentación de APIs - Pastelería Mil Sabores

**Proyecto:** Pastelería Mil Sabores  
**Versión:** 1.0 (Evaluación Parcial 3)  
**Fecha:** 12/11/2026  
**URL Base:** `http://localhost:9091/api/v1`  
**URL Swagger:** `http://localhost:9091/swagger-ui.html`  
**Formato:** Cumplimiento estricto de la plantilla tabular del **Anexo 3**.

---

| Método HTTP | Ruta del Endpoint | Descripción | Datos de entrada | Respuestas | API Pública / Privada | Requiere Autenticación | Roles permitidos | Observaciones |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **POST** | `/api/v1/auth/login` | Inicia sesión y genera token JWT | `{"correo": "...", "password": "..."}` | `200`: Éxito con JWT, `401`: Credenciales inválidas, `400`: Datos faltantes | Pública | No | N/A | Valida hash BCrypt. Retorna token y perfil sin contraseña. |
| **POST** | `/api/v1/auth/registro` | Registra usuario y entrega sesión | `{"nombre": "...", "correo": "...", "password": "...", "fechaNacimiento": "...", "codigoPromo": "..."}` | `201`: Creado, `400`: Fecha inválida/datos, `409`: Correo duplicado | Pública | No | N/A | Calcula beneficios MAYOR_50 (>50 años) o FELICES50 (cupón 10%). |
| **POST** | `/api/v1/auth/refresh` | Renueva token JWT antes de vencer | `{"token": "..."}` | `200`: Nuevo token, `400`: Token expirado/inválido | Privada | Sí | Todos los roles | Permite extender la sesión sin reingresar credenciales. |
| **GET** | `/api/v1/productos` | Lista todo el catálogo de productos | N/A | `200`: Éxito con lista de productos, `500`: Error de servidor | Pública | No | N/A | Retorna fotos, existencias, precios y porcentajes de descuento. |
| **GET** | `/api/v1/productos/{id}` | Obtiene el detalle de un producto | N/A | `200`: Éxito, `404`: No encontrado | Pública | No | N/A | Consulta de ingredientes y stock. Usado por Cliente y Vendedor. |
| **POST** | `/api/v1/productos` | Da de alta una nueva torta o postre | `{"nombre": "...", "categoria": "...", "precio": 45000, "stock": 12, ...}` | `201`: Creado, `400`: Datos inválidos, `403`: Acceso denegado | Privada | Sí | Administrador | Exclusivo para administradores. Valida precio y stock positivo. |
| **PUT** | `/api/v1/productos/{id}` | Actualiza datos de un producto | `{"nombre": "...", "precio": ..., "stock": ..., "enOferta": ...}` | `200`: Éxito, `400`: Inválido, `404`: No existe, `403`: Prohibido | Privada | Sí | Administrador | Permite modificar existencias, precios y activar ofertas. |
| **DELETE** | `/api/v1/productos/{id}` | Elimina un producto del catálogo | N/A | `204`: Sin contenido, `404`: No existe, `403`: Prohibido | Privada | Sí | Administrador | Baja física del producto en el inventario de la base de datos. |
| **GET** | `/api/v1/categorias` | Lista las familias de productos | N/A | `200`: Éxito, `500`: Error del servidor | Pública | No | N/A | Tortas Cuadradas, Tortas Circulares, Sin Azúcar, Sin Gluten. |
| **POST** | `/api/v1/categorias` | Agrega una nueva categoría | `{"nombre": "Postres Individuales", "descripcion": "..."}` | `201`: Creado, `400`: Vacío, `409`: Duplicado, `403`: Prohibido | Privada | Sí | Administrador | Valida que el nombre de la categoría sea único en la tienda. |
| **DELETE** | `/api/v1/categorias/{id}` | Elimina una categoría del sistema | N/A | `204`: Eliminada, `404`: No encontrada, `403`: Prohibido | Privada | Sí | Administrador | Restringido exclusivamente al Administrador General. |
| **POST** | `/api/v1/ordenes` | Emite y registra boleta de compra | `{"clienteNombre": "...", "clienteCorreo": "...", "total": ..., "items": [...]}` | `201`: Creada con ID, `400`: Carrito vacío o datos faltantes | Pública | No | Cliente / Público | Descuenta inventario de bodega de forma transaccional. |
| **GET** | `/api/v1/ordenes` | Lista historial de órdenes / boletas | N/A | `200`: Éxito, `401`: Sin token, `403`: Acceso denegado | Privada | Sí | Administrador, Vendedor | Permite al Vendedor gestionar despachos y al Admin auditoría. |
| **GET** | `/api/v1/ordenes/{id}` | Obtiene el detalle de una boleta | N/A | `200`: Éxito con items, `404`: No encontrada, `403`: Prohibido | Privada | Sí | Administrador, Vendedor | Muestra cliente, dirección de entrega, items, precios y totales. |
| **GET** | `/api/v1/usuarios` | Lista los usuarios registrados | N/A | `200`: Éxito, `401`: No autenticado, `403`: Prohibido | Privada | Sí | Administrador | Exclusivo para Administrador. La contraseña nunca se serializa. |
| **POST** | `/api/v1/usuarios` | Crea usuario con rol asignado | `{"nombre": "...", "correo": "...", "password": "...", "rol": "VENDEDOR"}` | `201`: Creado, `400`: Error datos, `409`: Correo existente | Privada | Sí | Administrador | Permite al Admin crear perfiles Vendedor o Clientes directamente. |
| **PUT** | `/api/v1/usuarios/{id}` | Modifica datos o rol de usuario | `{"nombre": "...", "rol": "ADMINISTRADOR", ...}` | `200`: Éxito, `404`: No encontrado, `403`: Prohibido | Privada | Sí | Administrador | Modificación de roles, fecha de nacimiento o beneficios. |
| **DELETE** | `/api/v1/usuarios/{id}` | Elimina la cuenta de un usuario | N/A | `204`: Eliminado, `404`: No encontrado, `403`: Prohibido | Privada | Sí | Administrador | Elimina el acceso del usuario en la base de datos MySQL. |

