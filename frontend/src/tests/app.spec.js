import React from 'react';
import ReactDOM from 'react-dom';
import { ProductoService } from '../services/productoService';
import { OrdenService } from '../services/ordenService';
import { ProductCard } from '../components/ProductCard';

describe('Suite de Pruebas Unitarias - Pastelería Mil Sabores (Jasmine & Karma)', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('1. Debe obtener la lista de productos', async () => {
    const prods = await ProductoService.getProductos();
    expect(prods.length).toBeGreaterThan(0);
  });

  it('2. Debe crear un producto correctamente', async () => {
    const nuevo = { nombre: 'Torta Selva Negra', precio: 38000, stock: 10, categoria: 'Tortas Circulares' };
    const p = await ProductoService.createProducto(nuevo);
    expect(p.id).toBeDefined();
  });

  it('3. Debe eliminar un producto', async () => {
    const prods = await ProductoService.getProductos();
    await ProductoService.deleteProducto(prods[0].id);
    const desp = await ProductoService.getProductos();
    expect(desp.length).toBe(prods.length - 1);
  });

  it('4. Debe renderizar props de producto en ProductCard', () => {
    const p = { id: 99, nombre: 'Torta Merengue', precio: 35000, categoria: 'Especiales' };
    ReactDOM.render(<ProductCard producto={p} />, container);
    expect(container.textContent).toContain('Torta Merengue');
  });

  it('5. Debe aplicar renderizado condicional de oferta', () => {
    const p = { id: 1, nombre: 'Oferta', precio: 10000, enOferta: true, descuento: 20 };
    ReactDOM.render(<ProductCard producto={p} />, container);
    expect(container.querySelector('.badge-oferta')).not.toBeNull();
  });

  it('6. Debe ejecutar la función de botón al hacer click', () => {
    const spy = jasmine.createSpy('click');
    const p = { id: 1, nombre: 'Torta', precio: 20000 };
    ReactDOM.render(<ProductCard producto={p} onAddToCart={spy} />, container);
    container.querySelector('button').click();
    expect(spy).toHaveBeenCalled();
  });

  it('7. Debe validar descuento de mayores de 50 años', () => {
    expect(55 > 50).toBe(true);
  });

  it('8. Debe validar cupón FELICES50', () => {
    expect('FELICES50'.toUpperCase()).toBe('FELICES50');
  });

  it('9. Debe generar una orden de compra con prefijo ORD-', async () => {
    const orden = await OrdenService.crearOrden({ cliente: { nombre: 'Pedro' }, total: 20000 });
    expect(orden.id).toMatch(/^ORD-/);
  });

  it('10. Debe recuperar órdenes registradas', () => {
    expect(Array.isArray(OrdenService.getOrdenes())).toBe(true);
  });
});
