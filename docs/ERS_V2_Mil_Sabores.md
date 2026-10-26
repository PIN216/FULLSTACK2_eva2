# Especificación de Requisitos de Software (ERS V2)
**Proyecto**: Pastelería Mil Sabores - Tienda Online
**Asignatura**: DSY1104 - Desarrollo Fullstack II
**Institución**: Escuela de Informática y Telecomunicaciones, Duoc UC

---

## 1. Alcance del Proyecto
Actualización de la tienda online hacia una arquitectura moderna basada en React con Bootstrap en el frontend y Spring Boot en el backend, incorporando persistencia desacoplada y una batería de pruebas unitarias con Vitest.

## 2. Requerimientos Funcionales (RF)

| Código | Requerimiento | Descripción |
| :--- | :--- | :--- |
| **RF-01** | Catálogo Responsivo | Renderizado modular mediante componentes React (`ProductCard`, `Navbar`, `Footer`) con diseño adaptativo en Bootstrap. |
| **RF-02** | Filtrado por Categorías | Navegación dinámica entre categorías (Tortas Cuadradas, Circulares, Sin Azúcar, Sin Gluten). |
| **RF-03** | Carrito de Compras | Adición de productos, incremento/decremento de cantidades, cálculo reactivo de subtotal y total con almacenamiento persistente. |
| **RF-04** | Checkout y Despacho | Formulario de datos personales y dirección de entrega con auto-completado si el usuario ha iniciado sesión. |
| **RF-05** | Pasarela de Pago Simulada | Bifurcación del flujo de compra: vista de confirmación con generación de ID de orden o vista de reintento ante fallo bancario. |
| **RF-06** | Panel Administrativo | Vista protegida con métricas de inventario, compras realizadas y operaciones CRUD completas sobre el catálogo de productos. |
| **RF-07** | Integración Fullstack | API REST desacoplada construida en Java Spring Boot con configuración CORS para consumo desde el frontend React. |
| **RF-08** | Calidad de Software | Pruebas unitarias en Vitest que verifican renderizado, props, state, eventos y reglas de negocio. |
