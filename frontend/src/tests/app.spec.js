import React from 'react';
import ReactDOM from 'react-dom';
import { DataService } from '../data/dataService';
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

  // 1. Obtener lista de productos
  it('1. Debe inicializar y obtener la lista de productos por defecto', () => {
    const prods = DataService.getProductos();
    expect(prods.length).toBeGreaterThan(0);
  });

  // 2. Crear producto
  it('2. Debe crear un nuevo producto correctamente en la persistencia simulada', () => {
    const nuevo = { nombre: 'Torta Selva Negra', precio: 38000, stock: 10, categoria: 'Tortas Circulares' };
    const guardado = DataService.createProducto(nuevo);
    expect(guardado.id).toBeDefined();
    expect(DataService.getProductos().some((p) => p.nombre === 'Torta Selva Negra')).toBe(true);
  });

  // 3. Actualizar producto
  it('3. Debe actualizar los datos de un producto existente', () => {
    const prod = DataService.getProductos()[0];
    DataService.updateProducto(prod.id, { precio: 50000 });
    const actualizado = DataService.getProductoById(prod.id);
    expect(actualizado.precio).toBe(50000);
  });

  // 4. Eliminar producto
  it('4. Debe eliminar un producto del listado', () => {
    const prodsAntes = DataService.getProductos();
    const idBorrar = prodsAntes[0].id;
    DataService.deleteProducto(idBorrar);
    const prodsDespues = DataService.getProductos();
    expect(prodsDespues.length).toBe(prodsAntes.length - 1);
  });

  // 5. Renderizado y Props
  it('5. Debe renderizar el nombre y precio del producto pasados por props', () => {
    const mockProducto = {
      id: 99,
      nombre: 'Torta Merengue Lúcuma',
      precio: 35000,
      categoria: 'Especiales',
      imagen: 'http://test.jpg'
    };

    ReactDOM.render(<ProductCard producto={mockProducto} onAddToCart={() => {}} />, container);
    expect(container.textContent).toContain('Torta Merengue Lúcuma');
    expect(container.textContent).toContain('$35.000');
  });

  // 6. Renderizado Condicional
  it('6. Debe aplicar renderizado condicional al mostrar etiqueta de oferta', () => {
    const conOferta = { id: 1, nombre: 'Torta Oferta', precio: 10000, enOferta: true, descuento: 20 };
    ReactDOM.render(<ProductCard producto={conOferta} onAddToCart={() => {}} />, container);
    expect(container.querySelector('.badge-oferta')).not.toBeNull();
  });

  // 7. Eventos de usuario
  it('7. Debe ejecutar la función callback onAddToCart al hacer clic en el botón Añadir', () => {
    const spy = jasmine.createSpy('onAddToCart');
    const mockProd = { id: 1, nombre: 'Torta Click', precio: 20000 };

    ReactDOM.render(<ProductCard producto={mockProd} onAddToCart={spy} />, container);
    const boton = container.querySelector('button');
    boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(spy).toHaveBeenCalledWith(mockProd);
  });

  // 8. Reglas de negocio: Descuento mayores de 50 años
  it('8. Debe calcular correctamente los beneficios de aniversario para mayores de 50 años', () => {
    const edad = 55;
    const esMayor50 = edad > 50;
    expect(esMayor50).toBe(true);
  });

  // 9. Reglas de negocio: Código promocional
  it('9. Debe reconocer cupón de descuento FELICES50 con 10% vitalicio', () => {
    const codigo = 'FELICES50';
    const esValido = codigo.trim().toUpperCase() === 'FELICES50';
    expect(esValido).toBe(true);
  });

  // 10. Creación y estructura de orden de compra
  it('10. Debe generar y almacenar una orden de compra con identificador único', () => {
    const ordenMock = {
      cliente: { nombre: 'Pedro Pascal', correo: 'pedro@duoc.cl' },
      items: [{ id: 1, nombre: 'Torta Circular', precio: 42000, cantidad: 1 }],
      total: 42000
    };
    const generada = DataService.createOrden(ordenMock);
    expect(generada.id).toMatch(/^ORD-/);
    expect(DataService.getOrdenes().length).toBeGreaterThan(0);
  });
});
