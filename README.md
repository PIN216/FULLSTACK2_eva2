# Pastelería Mil Sabores - Evaluación Parcial N° 2 (DSY1104)

Este proyecto corresponde a la entrega de la Evaluación Parcial 2 de Desarrollo Fullstack II (Duoc UC).
Contiene la solución completa requerida:
- **frontend/**: Aplicación en React con Bootstrap, arquitectura basada en componentes (Single Responsibility), vistas públicas y panel administrativo, y 10 pruebas unitarias con Jasmine y Karma.
- **backend/**: API REST desarrollada con Java Spring Boot y Spring Data JPA (H2 en memoria) para la persistencia e integración fullstack.
- **docs/**: Especificación de Requisitos de Software (ERS V2) y Documento de Cobertura de Testing.

## Requisitos

| Herramienta | Versión |
| :--- | :--- |
| Node.js | 18 o superior |
| JDK | 17 o 21 (recomendado) |
| Maven | 3.8 o superior |
| Google Chrome / Chromium | solo para `npm test` (si Karma no lo encuentra, define `CHROME_BIN`) |

## Instrucciones de Ejecución

Levanta primero el backend y luego el frontend (en dos terminales).

### Backend (http://localhost:8080)
```bash
cd backend
mvn spring-boot:run
```
- Al arrancar se carga el catálogo inicial de 4 productos (`DataLoader`).
- Base de datos H2 en memoria: los datos se reinician al detener el servidor. Consola en `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:milsaboresdb`, usuario `sa`, sin contraseña).
- Pruebas del backend: `mvn test`.

### Frontend (http://localhost:3000)
```bash
cd frontend
npm install
npm start          # (también funciona: npm run dev)
npm test           # 10 pruebas unitarias con Karma y Jasmine + reporte de cobertura en frontend/coverage/
```
- Si el backend corre en otra URL, copia `frontend/.env.example` a `frontend/.env` y cambia `REACT_APP_API_URL`.
- Si el backend está apagado, la tienda sigue funcionando con un respaldo en `localStorage` (catálogo por defecto, carrito, órdenes).

### Usuario administrador de prueba
`admin@milsabores.cl` / `Admin1234`

## Reglas de descuento
- Productos en oferta: se les aplica su porcentaje de descuento.
- Clientes mayores de 50 años: 50 % de descuento.
- Código `FELICES50` al registrarse: 10 % de descuento vitalicio.
- Los descuentos de cliente no se acumulan: se aplica el mayor.
