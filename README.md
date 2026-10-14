# Pastelería Mil Sabores - Evaluación Parcial N° 2 (DSY1104)

Este proyecto corresponde a la entrega de la Evaluación Parcial 2 de Desarrollo Fullstack II (Duoc UC).
Contiene la solución completa requerida:
- **frontend/**: Aplicación en React con Bootstrap, arquitectura basada en componentes (Single Responsibility), persistencia simulada con CRUD en JS, vistas públicas y panel administrativo, y 10 pruebas unitarias con Jasmine y Karma.
- **backend/**: API REST desarrollada con Java Spring Boot y Spring Data JPA para la persistencia e integración fullstack.
- **docs/**: Especificación de Requisitos de Software (ERS V2) y Documento de Cobertura de Testing.

## Instrucciones de Ejecución

### Frontend
```bash
cd frontend
npm install
npm run dev    # Iniciar servidor de desarrollo
npm test       # Ejecutar las 10 pruebas unitarias con Karma y Jasmine
```

### Backend
```bash
cd backend
mvn spring-boot:run
```
