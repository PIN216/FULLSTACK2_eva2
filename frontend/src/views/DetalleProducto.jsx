import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { ProductoService } from '../services/productoService';

export const DetalleProducto = () => {
  const { selectedProductId, addToCart, setCurrentView } = useContext(StoreContext);
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    ProductoService.getProductoById(selectedProductId).then(setProducto);
  }, [selectedProductId]);

  if (!producto) return <div className="container py-5 text-center">Cargando producto...</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6"><img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded w-100" /></div>
          <div className="col-md-6">
            <span className="badge bg-secondary mb-2">{producto.categoria}</span>
            <h2 className="fw-bold text-brown">{producto.nombre}</h2>
            <p className="text-muted mt-3">{producto.descripcion}</p>
            <h3 className="fw-bold text-success my-3">${producto.precio?.toLocaleString('es-CL')}</h3>
            <button className="btn btn-success btn-lg me-3" onClick={() => addToCart(producto)}>🛒 Agregar al Carrito</button>
            <button className="btn btn-outline-secondary btn-lg" onClick={() => setCurrentView('home')}>Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
};
