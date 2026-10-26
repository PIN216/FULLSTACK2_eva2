# Documento de Cobertura de Testing (Vitest)
**Asignatura**: DSY1104 - Desarrollo Fullstack II

---

## Matriz de Cobertura de Pruebas Unitarias

Archivo: `frontend/src/tests/app.test.jsx`. Las pruebas se ejecutan con `npm test` (Vitest + jsdom, sin abrir un navegador) y no requieren el backend: se simula su ausencia y se usa el respaldo local.

| N° | Tipo de Prueba | Componente / Función Evaluada | Comportamiento Esperado |
| :---: | :--- | :--- | :--- |
| **1** | Persistencia CRUD | `ProductoService.getProductos()` | Retorna el catálogo inicial (4 productos). |
| **—** | Persistencia local | `ProductoService.getProductos()` | Reemplaza la imagen antigua de la torta de manjar guardada en `localStorage`. |
| **2** | Persistencia CRUD | `ProductoService.createProducto()` | Añade un producto con ID generado y aumenta el catálogo en 1. |
| **3** | Persistencia CRUD | `ProductoService.deleteProducto()` | Elimina el producto y reduce el catálogo en 1. |
| **4** | Renderizado / Props | `ProductCard` (Props) | Renderiza nombre y precio formateado en el DOM. |
| **5** | Renderizado Condicional | `ProductCard` (Ofertas) | Muestra el badge `badge-oferta` y el precio con descuento solo si `enOferta === true`. |
| **6** | Simulación de Eventos | Botón Añadir (`onClick`) | Ejecuta el callback pasando el objeto producto. |
| **7** | Regla de Negocio | `calcularBeneficios()` / `calcularTotales()` | Clientes con edad > 50 años reciben 50 % de descuento. |
| **8** | Regla de Negocio | `calcularBeneficios()` / `calcularTotales()` | El cupón `FELICES50` otorga 10 % vitalicio. |
| **9** | Manejo de Estado | `OrdenService.crearOrden()` | Genera la orden con ID de prefijo `ORD-` y el total indicado. |
| **10** | Persistencia | `OrdenService.getOrdenes()` / `getOrdenById()` | Recupera las órdenes registradas. |
| **11** | Persistencia | `CategoriaService.getCategorias()` | Con el backend apagado devuelve las 4 categorías del respaldo local. |
| **12** | Manejo de errores | `UsuarioService.login()` | Rechaza la promesa si el backend no responde (no hay sesión offline). |

## Cómo ejecutarlas

| Comando | Qué hace |
| :--- | :--- |
| `npm test` | Ejecuta todas las pruebas una vez. |
| `npm run test:watch` | Modo interactivo: vuelve a ejecutar al guardar un archivo. |
| `npm run test:coverage` | Ejecuta las pruebas y genera la cobertura (resumen en consola y reporte HTML en `frontend/coverage/`). |

> El resultado (PASS/FAIL) debe tomarse de la salida real de `npm test`.
