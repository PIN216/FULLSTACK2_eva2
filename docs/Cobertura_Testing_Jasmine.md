# Documento de Cobertura de Testing (Jasmine & Karma)
**Asignatura**: DSY1104 - Desarrollo Fullstack II

---

## Matriz de Cobertura de Pruebas Unitarias (10/10)

| N° | Tipo de Prueba | Componente / Función Evaluada | Comportamiento Esperado | Resultado |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Persistencia CRUD | `DataService.getProductos()` | Retorna el listado inicial de productos cargados. | PASS |
| **2** | Persistencia CRUD | `DataService.createProducto()` | Añade un nuevo producto con ID generado dinámicamente. | PASS |
| **3** | Persistencia CRUD | `DataService.updateProducto()` | Modifica propiedades de un producto existente. | PASS |
| **4** | Persistencia CRUD | `DataService.deleteProducto()` | Elimina un producto reduciendo la longitud del catálogo. | PASS |
| **5** | Renderizado / Props | `ProductCard` (Props) | Renderiza nombre y precio formateado en el DOM. | PASS |
| **6** | Renderizado Condicional | `ProductCard` (Ofertas) | Muestra el badge `badge-oferta` únicamente si `enOferta === true`. | PASS |
| **7** | Simulación de Eventos | Botón Añadir (`onClick`) | Ejecuta la función callback pasando el objeto producto. | PASS |
| **8** | Regla de Negocio | Descuento Adulto Mayor | Verifica que clientes con edad > 50 años reciban 50% de dcto. | PASS |
| **9** | Regla de Negocio | Código Promocional | Valida activación del cupón `FELICES50` (10% vitalicio). | PASS |
| **10** | Manejo de Estado | `DataService.createOrden()` | Genera orden de compra con prefijo `ORD-` y total acumulado. | PASS |

**Conclusión de Calidad**: Se alcanza el 100% de cumplimiento para el indicador IE2.2.1 de la rúbrica institucional (10 pruebas unitarias verificadas sin errores).
