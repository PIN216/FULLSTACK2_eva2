import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { DataService } from '../data/dataService';

export const DetalleProducto = () => {
  const { selectedProductId, addToCart, setCurrentView } = useContext(StoreContext);
  const producto = DataService.getProductoById(selectedProductId) || DataService.getProductos()[0];

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h4>Producto no encontrado</h4>
        <button className="btn btn-primary mt-3" onClick={() => setCurrentView('home')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow-sm w-100" />
          </div>
          <div className="col-md-6">
            <span className="badge bg-secondary mb-2">{producto.categoria}</span>
            <h2 className="fw-bold text-brown">{producto.nombre}</h2>
            <p className="text-muted mt-3">{producto.descripcion}</p>
            <h3 className="fw-bold text-success my-3">${producto.precio?.toLocaleString('es-CL')}</h3>
            <p className="small text-muted">Stock disponible: {producto.stock} unidades</p>
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-success btn-lg px-4" onClick={() => addToCart(producto)}>
                🛒 Agregar al Carrito
              </button>
              <button className="btn btn-outline-secondary btn-lg" onClick={() => setCurrentView('home')}>
                Volver al Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
