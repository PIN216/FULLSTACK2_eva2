# Documento de Cobertura de Testing (Vitest)
**Asignatura**: DSY1104 - Desarrollo Fullstack II
**Proyecto**: Pastelería Mil Sabores (frontend React)

---

## 1. ¿Para qué sirven estas pruebas?

Una **prueba unitaria** es un pequeño programa que ejecuta una pieza concreta del código (una función, un componente) con datos conocidos y comprueba que el resultado sea el esperado. Si alguien modifica el código y rompe algo, la prueba falla y avisa **antes** de que el error llegue al cliente.

Las 10 pruebas de este proyecto protegen cuatro funciones clave de la tienda:

| Qué protegen | Por qué importa | Pruebas |
| :--- | :--- | :---: |
| **Búsqueda de productos** | El cliente debe encontrar las tortas sin importar si escribe en mayúsculas o minúsculas, y no debe ver resultados falsos. | 1, 2 |
| **Carrito de compras** | Es el corazón de la compra: agregar productos, mostrarlos y no vender más unidades de las que existen. | 3, 4, 5, 10 |
| **Precios y descuentos** | Un error de cálculo significa cobrar de más o de menos (ofertas, 50 % a mayores de 50 años, 10 % con `FELICES50`). | 6, 7, 8 |
| **Validación del correo** | Evita registrar o iniciar sesión con correos imposibles. | 9 |

### Cómo están hechas

- **Vitest + jsdom**: Vitest ejecuta las pruebas y jsdom simula el navegador (`document`, `localStorage`), por eso no hace falta abrir Chrome ni tener el backend encendido.
- **Datos propios de prueba**: las pruebas usan un `CATALOGO` de 4 productos definido dentro del archivo, así no dependen del backend ni de lo que haya guardado el navegador.
- **Aislamiento**: antes de cada prueba se limpia `localStorage` (el carrito parte vacío) y después se desmonta el componente, para que una prueba no afecte a la siguiente.
- **`Probe` (componente auxiliar)**: un componente sin pantalla que «espía» el `StoreContext` para que la prueba pueda llamar a `addToCart` y leer `cart` y `cartTotal`.
- **`expect(...)`**: es la comprobación. Por ejemplo, `expect(total).toBe(10000)` significa «el total debe ser exactamente 10000»; si no lo es, la prueba falla (FAIL).

---

## 2. Matriz de Cobertura de Pruebas Unitarias

Archivo: `frontend/src/tests/app.test.jsx` — **10 pruebas**. Se ejecutan con `npm test`.

| N° | Tipo de prueba | Componente / función evaluada | Comportamiento esperado | ¿Para qué sirve? |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Búsqueda | `buscarProductos()` | Una búsqueda sin coincidencias (por ejemplo «pizza») devuelve una lista vacía. | Evita mostrar productos que no corresponden y permite mostrar el mensaje «sin resultados». |
| **2** | Búsqueda | `buscarProductos()` | «CHOCOLATE» y «chocolate» devuelven el mismo producto (Torta Cuadrada de Chocolate). | Garantiza que el cliente encuentre el producto sin importar cómo escriba. |
| **3** | Carrito | `addToCart()` (`StoreContext`) | Agregar un producto deja 1 ítem en el carrito, con `id` correcto y cantidad 1. | Verifica la acción básica de «Añadir al carrito». |
| **4** | Carrito + precios | `addToCart()` y `cartTotal` | Agregar 3 productos distintos deja 3 ítems; el total aplica las ofertas: 45.000 + 35.700 + 2 × 3.600. | Comprueba que el carrito maneje varios productos, cantidades y que el total sea el que realmente se cobra. |
| **5** | Renderizado | `CarritoView` | Vacío muestra «Tu carrito de compras está vacío»; con productos muestra solo los agregados (nombre y precio) y no los demás. | Asegura que la pantalla del carrito muestre lo que el cliente realmente eligió. |
| **6** | Regla de negocio | `precioFinal()` | Torta de Manjar (42.000 con 15 % de oferta) cuesta 35.700; un producto sin oferta mantiene su precio. | Garantiza que el precio mostrado sea el que se cobra. |
| **7** | Regla de negocio | `calcularTotales()` (beneficio `MAYOR_50`) | Un cliente con `MAYOR_50` recibe 50 % de descuento: 20.000 → 10.000. | Cumple la regla del ERS para clientes mayores de 50 años. |
| **8** | Regla de negocio | `calcularTotales()` (`FELICES50` y `MAYOR_50`) | `FELICES50` da 10 % (20.000 → 18.000) y, si el cliente tiene ambos beneficios, no se suman: se aplica el mayor (10.000). | Cumple la regla «los descuentos de cliente no se acumulan». |
| **9** | Validación | `validarCorreo()` | Un correo válido devuelve `''`; uno inválido devuelve un mensaje de error; vacío devuelve «El correo es obligatorio.». | Evita datos incorrectos en el registro y el inicio de sesión. |
| **10** | Regla de negocio | `addToCart()` (tope de stock) | Intentar agregar 5 veces un producto con stock 2 deja una sola línea con cantidad 2. | Evita vender más unidades de las que hay disponibles. |

---

## 3. Cómo ejecutarlas

Desde la carpeta `frontend/`:

| Comando | Qué hace |
| :--- | :--- |
| `npm test` | Ejecuta todas las pruebas una vez. |
| `npm run test:watch` | Modo interactivo: vuelve a ejecutar al guardar un archivo. |
| `npm run test:coverage` | Ejecuta las pruebas y genera la cobertura (resumen en consola y reporte HTML en `frontend/coverage/index.html`). |

> El resultado (PASS/FAIL) y los porcentajes de cobertura deben tomarse de la salida real de la consola, no estimarse.

## 4. Cómo leer el reporte de cobertura

La **cobertura** indica qué porcentaje del código fue ejecutado por las pruebas:

| Columna | Significa |
| :--- | :--- |
| `Statements` | Porcentaje de sentencias de código ejecutadas. |
| `Branches` | Porcentaje de ramas (`if`, `?:`, `&&`) recorridas, tanto por el camino «verdadero» como por el «falso». |
| `Functions` | Porcentaje de funciones llamadas al menos una vez. |
| `Lines` | Porcentaje de líneas ejecutadas. |

Una cobertura alta no garantiza que no haya errores, pero una cobertura baja indica código que ninguna prueba comprueba. Abre `frontend/coverage/index.html` para ver, línea por línea, qué quedó sin ejecutar.

### Resultado de la última ejecución

| Dato | Valor |
| :--- | :--- |
| Fecha de ejecución | _(completar)_ |
| Pruebas aprobadas / total | _(completar)_ / 10 |
| Statements / Branches / Functions / Lines | _(completar)_ |
