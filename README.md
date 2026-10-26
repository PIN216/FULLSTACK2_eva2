# Pastelería Mil Sabores - Evaluación Parcial N° 2 (DSY1104)

Este proyecto corresponde a la entrega de la Evaluación Parcial 2 de Desarrollo Fullstack II (Duoc UC).
Contiene la solución completa requerida:
- **frontend/**: Aplicación en React con Bootstrap, arquitectura basada en componentes (Single Responsibility), vistas públicas y panel administrativo, y pruebas unitarias con Vitest.
- **backend/**: API REST desarrollada con Java Spring Boot y Spring Data JPA (H2 en memoria) para la persistencia e integración fullstack.
- **docs/**: Especificación de Requisitos de Software (ERS V2) y Documento de Cobertura de Testing.

## Requisitos

| Herramienta | Versión |
| :--- | :--- |
| Node.js | 20.19 o superior (o 22.12+), requerido por Vitest |
| JDK | 17 o 21 (recomendado) |
| Maven | 3.8 o superior |

## Instrucciones de Ejecución

Levanta primero el backend y luego el frontend (en dos terminales).

### Backend (http://localhost:9091)

#Para arrancar el backend haga click derecho sobre backend\src\main\java\com\pasteleria\PasteleriaApplication.java y seleccione "Run java"

### Backend (http://localhost:9091)
```bash
cd backend
mvn spring-boot:run
```
- Al arrancar, `DataLoader` inserta en la base SQL los datos iniciales: 4 categorías, 4 productos y el usuario administrador (con la contraseña cifrada con BCrypt). Si la tabla ya tiene datos, no los duplica.
- Endpoints: `/api/productos`, `/api/categorias`, `/api/usuarios` (`/registro` y `/login`) y `/api/ordenes`.
- Base de datos H2 en memoria: los datos se reinician al detener el servidor. Consola en `http://localhost:9091/h2-console` (JDBC URL: `jdbc:h2:mem:milsaboresdb`, usuario `sa`, sin contraseña).
- Pruebas del backend: `mvn test`.

### Frontend (http://localhost:3000)
```bash
cd frontend
npm install
npm start          # (también funciona: npm run dev)
npm test           # pruebas unitarias con Vitest (una sola ejecución)
npm run test:watch      # modo interactivo, vuelve a ejecutar al guardar
npm run test:coverage   # cobertura: resumen en consola y reporte HTML en frontend/coverage/
```
- Si el backend corre en otra URL, copia `frontend/.env.example` a `frontend/.env` y cambia `REACT_APP_API_URL`.
- Si el backend está apagado, el catálogo, las categorías, el carrito y las órdenes siguen funcionando con un respaldo en `localStorage`. **Iniciar sesión y registrarse requieren el backend.**

### Usuario administrador de prueba
`admin@milsabores.cl` / `Admin1234`

## Reglas de descuento
- Productos en oferta: se les aplica su porcentaje de descuento.
- Clientes mayores de 50 años: 50 % de descuento.
- Código `FELICES50` al registrarse: 10 % de descuento vitalicio.
- Los descuentos de cliente no se acumulan: se aplica el mayor.
