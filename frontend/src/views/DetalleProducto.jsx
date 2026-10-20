import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { ProductoService } from '../services/productoService';
import { precioFinal } from '../services/descuentoService';

const clp = (n) => `$${Number(n).toLocaleString('es-CL')}`;

export const DetalleProducto = () => {
  const { selectedProductId, addToCart, setCurrentView } = useContext(StoreContext);
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    ProductoService.getProductoById(selectedProductId).then((p) => {
      if (activo) { setProducto(p || null); setCargando(false); }
    });
    return () => { activo = false; };
  }, [selectedProductId]);

  if (cargando) return <div className="container py-5 text-center">Cargando producto...</div>;

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Producto no encontrado.</div>
        <button className="btn btn-outline-secondary" onClick={() => setCurrentView('home')}>Volver</button>
      </div>
    );
  }

  const final = precioFinal(producto);
  const conDescuento = final < Number(producto.precio);

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6"><img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded w-100" /></div>
          <div className="col-md-6">
            <span className="badge bg-secondary mb-2">{producto.categoria}</span>
            <h2 className="fw-bold text-brown">{producto.nombre}</h2>
            <p className="text-muted mt-3">{producto.descripcion}</p>
            <h3 className="fw-bold text-success my-3">
              {conDescuento && <small className="text-muted text-decoration-line-through me-2 fs-5">{clp(producto.precio)}</small>}
              {clp(final)}
              {conDescuento && <span className="badge bg-danger ms-2 fs-6">-{producto.descuento}% OFF</span>}
            </h3>
            <p className="small text-muted">Stock disponible: {producto.stock ?? 0}</p>
            <button className="btn btn-success btn-lg me-3" disabled={!(producto.stock > 0)} onClick={() => addToCart(producto)}>🛒 Agregar al Carrito</button>
            <button className="btn btn-outline-secondary btn-lg" onClick={() => setCurrentView('home')}>Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
};
