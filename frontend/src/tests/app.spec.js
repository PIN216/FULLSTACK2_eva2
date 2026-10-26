import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ProductoService } from '../services/productoService';
import { OrdenService } from '../services/ordenService';
import { ProductCard } from '../components/ProductCard';
import { calcularBeneficios, calcularTotales } from '../services/descuentoService';

describe('Suite de Pruebas Unitarias - Pastelería Mil Sabores (Jasmine & Karma)', () => {
  let container;
  let root;

  const render = (element) => {
    root = createRoot(container);
    flushSync(() => root.render(element));
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
    // Backend "apagado": las pruebas usan siempre el respaldo local y no dependen de que Spring esté corriendo.
    spyOn(window, 'fetch').and.callFake(() => Promise.reject(new Error('backend apagado')));
  });

  afterEach(() => {
    if (root) { flushSync(() => root.unmount()); root = null; }
    document.body.removeChild(container);
    container = null;
  });

  it('1. Debe obtener la lista de productos', async () => {
    const prods = await ProductoService.getProductos();
    expect(prods.length).toBe(4);
  });

  it('Debe actualizar la imagen antigua de la torta de manjar guardada localmente', async () => {
    localStorage.setItem('pms_productos', JSON.stringify([
      {
        id: 2,
        nombre: 'Torta Circular de Manjar',
        imagen: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600'
      }
    ]));

    const productos = await ProductoService.getProductos();

    expect(productos[0].imagen).toBe('https://www.elingenio.cl/productos/bizcocho-manjar-lucuma.jpg');
    expect(JSON.parse(localStorage.getItem('pms_productos'))[0].imagen).toBe(productos[0].imagen);
  });

  it('2. Debe crear un producto correctamente', async () => {
    const antes = await ProductoService.getProductos();
    const p = await ProductoService.createProducto({ nombre: 'Torta Selva Negra', precio: 38000, stock: 10, categoria: 'Tortas Circulares' });
    const despues = await ProductoService.getProductos();
    expect(p.id).toBeDefined();
    expect(despues.length).toBe(antes.length + 1);
  });

  it('3. Debe eliminar un producto', async () => {
    const prods = await ProductoService.getProductos();
    await ProductoService.deleteProducto(prods[0].id);
    const desp = await ProductoService.getProductos();
    expect(desp.length).toBe(prods.length - 1);
    expect(desp.some(p => p.id === prods[0].id)).toBe(false);
  });

  it('4. Debe renderizar nombre y precio formateado en ProductCard', () => {
    const p = { id: 99, nombre: 'Torta Merengue', precio: 35000, categoria: 'Especiales' };
    render(<ProductCard producto={p} />);
    expect(container.textContent).toContain('Torta Merengue');
    expect(container.textContent).toContain('35.000');
  });

  it('5. Debe mostrar el badge de oferta solo si enOferta es true', () => {
    render(<ProductCard producto={{ id: 1, nombre: 'Oferta', precio: 10000, enOferta: true, descuento: 20 }} />);
    expect(container.querySelector('.badge-oferta')).not.toBeNull();
    expect(container.textContent).toContain('8.000'); // precio con 20% de descuento
    flushSync(() => root.unmount());
    render(<ProductCard producto={{ id: 2, nombre: 'Normal', precio: 10000 }} />);
    expect(container.querySelector('.badge-oferta')).toBeNull();
  });

  it('6. Debe ejecutar la función de botón con el producto al hacer click', () => {
    const spy = jasmine.createSpy('click');
    const p = { id: 1, nombre: 'Torta', precio: 20000 };
    render(<ProductCard producto={p} onAddToCart={spy} />);
    container.querySelector('button').click();
    expect(spy).toHaveBeenCalledWith(p);
  });

  it('7. Debe aplicar 50% de descuento a clientes mayores de 50 años', () => {
    const hoy = new Date(2026, 9, 20);
    expect(calcularBeneficios({ fechaNacimiento: '1970-01-01' }, hoy)).toContain('MAYOR_50');
    expect(calcularBeneficios({ fechaNacimiento: '1976-10-20' }, hoy)).not.toContain('MAYOR_50'); // justo 50 años: no aplica
    const t = calcularTotales([{ id: 1, precio: 10000, cantidad: 2 }], { beneficios: ['MAYOR_50'] });
    expect(t.total).toBe(10000);
  });

  it('8. Debe aplicar 10% vitalicio con el cupón FELICES50', () => {
    const b = calcularBeneficios({ fechaNacimiento: '2000-01-01', codigoPromo: ' felices50 ' }, new Date(2026, 9, 20));
    expect(b).toEqual(['FELICES50']);
    const t = calcularTotales([{ id: 1, precio: 20000, cantidad: 1 }], { beneficios: b });
    expect(t.total).toBe(18000);
  });

  it('9. Debe generar una orden de compra con prefijo ORD-', async () => {
    const orden = await OrdenService.crearOrden({ cliente: { nombre: 'Pedro' }, total: 20000 });
    expect(orden.id).toMatch(/^ORD-/);
    expect(orden.total).toBe(20000);
  });

  it('10. Debe recuperar las órdenes registradas', async () => {
    expect(OrdenService.getOrdenes().length).toBe(0);
    const orden = await OrdenService.crearOrden({ cliente: { nombre: 'Ana' }, total: 5000 });
    expect(OrdenService.getOrdenes().length).toBe(1);
    expect(OrdenService.getOrdenById(orden.id).total).toBe(5000);
  });
});
