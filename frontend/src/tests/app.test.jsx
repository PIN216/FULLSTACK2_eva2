import { useContext } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buscarProductos } from '../services/busquedaService';
import { precioFinal, calcularTotales } from '../services/descuentoService';
import { validarCorreo } from '../services/validacionService';
import { StoreProvider, StoreContext } from '../context/StoreContext';
import { CarritoView } from '../views/CarritoView';

// Productos de prueba (independientes del backend y de localStorage).
const CATALOGO = [
  { id: 1, nombre: 'Torta Cuadrada de Chocolate', categoria: 'Tortas Cuadradas', precio: 45000, stock: 12, enOferta: false, descuento: 0 },
  { id: 2, nombre: 'Torta Circular de Manjar', categoria: 'Tortas Circulares', precio: 42000, stock: 8, enOferta: true, descuento: 15 },
  { id: 3, nombre: 'Cheesecake Sin Azúcar', categoria: 'Sin Azúcar', precio: 47000, stock: 5, enOferta: false, descuento: 0 },
  { id: 4, nombre: 'Brownie Sin Gluten', categoria: 'Sin Gluten', precio: 4000, stock: 25, enOferta: true, descuento: 10 }
];

describe('Suite de Pruebas Unitarias - Pastelería Mil Sabores (Vitest)', () => {
  let container;
  let root;
  let ctx; // contexto de la tienda, capturado por <Probe />

  // Componente auxiliar: expone el StoreContext para poder llamar addToCart, leer cart, etc.
  const Probe = () => {
    ctx = useContext(StoreContext);
    return null;
  };

  const render = (element) => {
    root = createRoot(container);
    flushSync(() => root.render(element));
  };

  const agregar = (producto, cantidad) => flushSync(() => ctx.addToCart(producto, cantidad));

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear(); // el carrito parte vacío en cada prueba
    ctx = null;
  });

  afterEach(() => {
    if (root) { flushSync(() => root.unmount()); root = null; }
    document.body.removeChild(container);
    container = null;
  });

  // ---------- Búsqueda ----------

  it('1. Una búsqueda sin coincidencias entrega cero productos', () => {
    const resultado = buscarProductos(CATALOGO, 'pizza');
    expect(resultado).toEqual([]);
    expect(resultado.length).toBe(0);
  });

  it('2. Buscar en mayúsculas y en minúsculas entrega el mismo producto', () => {
    const enMayusculas = buscarProductos(CATALOGO, 'CHOCOLATE');
    const enMinusculas = buscarProductos(CATALOGO, 'chocolate');

    expect(enMayusculas.length).toBe(1);
    expect(enMinusculas.length).toBe(1);
    expect(enMayusculas[0].id).toBe(enMinusculas[0].id);
    expect(enMayusculas[0].nombre).toBe('Torta Cuadrada de Chocolate');
  });

  // ---------- Carrito ----------

  it('3. Agregar un producto al carrito', () => {
    render(<StoreProvider><Probe /></StoreProvider>);
    expect(ctx.cart.length).toBe(0);

    agregar(CATALOGO[0]);

    expect(ctx.cart.length).toBe(1);
    expect(ctx.cart[0].id).toBe(1);
    expect(ctx.cart[0].cantidad).toBe(1);
  });

  it('4. Agregar distintos productos al carrito', () => {
    render(<StoreProvider><Probe /></StoreProvider>);

    agregar(CATALOGO[0]);
    agregar(CATALOGO[1]);
    agregar(CATALOGO[3], 2);

    expect(ctx.cart.length).toBe(3);
    expect(ctx.cart.map((i) => i.id)).toEqual([1, 2, 4]);
    expect(ctx.cart.find((i) => i.id === 4).cantidad).toBe(2);
    // Total = 45.000 + 42.000 con 15% (35.700) + 2 x 4.000 con 10% (3.600 c/u)
    expect(ctx.cartTotal).toBe(45000 + 35700 + 2 * 3600);
  });

  it('5. Mostrar los productos que están en el carrito', () => {
    render(<StoreProvider><Probe /><CarritoView /></StoreProvider>);
    // Con el carrito vacío se muestra el mensaje de carrito vacío.
    expect(container.textContent).toContain('Tu carrito de compras está vacío');

    agregar(CATALOGO[0]);
    agregar(CATALOGO[2]);

    expect(container.textContent).toContain('Torta Cuadrada de Chocolate');
    expect(container.textContent).toContain('Cheesecake Sin Azúcar');
    expect(container.textContent).not.toContain('Brownie Sin Gluten');
    expect(container.textContent).toContain('45.000');
    expect(container.textContent).toContain('47.000');
  });

  // ---------- Reglas de negocio y validaciones ----------

  it('6. El precio final aplica el descuento de la oferta del producto', () => {
    expect(precioFinal(CATALOGO[1])).toBe(35700); // 42.000 con 15% de descuento
    expect(precioFinal(CATALOGO[0])).toBe(45000); // sin oferta, se mantiene el precio
  });

  it('7. Un cliente con beneficio MAYOR_50 recibe 50% de descuento en el total', () => {
    const t = calcularTotales([{ id: 1, precio: 10000, cantidad: 2 }], { beneficios: ['MAYOR_50'] });
    expect(t.subtotal).toBe(20000);
    expect(t.porcentaje).toBe(50);
    expect(t.descuento).toBe(10000);
    expect(t.total).toBe(10000);
  });

  it('8. El descuento FELICES50 es de 10% y no se acumula con MAYOR_50 (se aplica el mayor)', () => {
    const items = [{ id: 1, precio: 20000, cantidad: 1 }];
    expect(calcularTotales(items, { beneficios: ['FELICES50'] }).total).toBe(18000);
    expect(calcularTotales(items, { beneficios: ['MAYOR_50', 'FELICES50'] }).total).toBe(10000);
  });

  it('9. Valida el formato del correo electrónico', () => {
    expect(validarCorreo('cliente@milsabores.cl')).toBe('');
    expect(validarCorreo('correo-invalido')).not.toBe('');
    expect(validarCorreo('')).toBe('El correo es obligatorio.');
  });

  it('10. El carrito no permite agregar más unidades que el stock disponible', () => {
    render(<StoreProvider><Probe /></StoreProvider>);
    const poco = { ...CATALOGO[2], stock: 2 };

    for (let i = 0; i < 5; i++) agregar(poco);

    expect(ctx.cart.length).toBe(1);
    expect(ctx.cart[0].cantidad).toBe(2);
  });
});
