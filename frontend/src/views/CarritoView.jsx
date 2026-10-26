import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { precioFinal } from '../services/descuentoService';

const clp = (n) => `$${Number(n).toLocaleString('es-CL')}`;

export const CarritoView = () => {
  const { cart, cartResumen, currentUser, updateQuantity, removeFromCart, setCurrentView } = useContext(StoreContext);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0">
          <h3>Tu carrito de compras está vacío 🛒</h3>
          <button className="btn btn-primary mt-3" onClick={() => setCurrentView('home')}>Ir al Catálogo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-brown">Carrito de Compras</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <table className="table align-middle mb-0">
              <thead className="table-light"><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr></thead>
              <tbody>
                {cart.map(item => {
                  const unit = precioFinal(item);
                  return (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>
                        {unit < item.precio && <small className="text-muted text-decoration-line-through me-1">{clp(item.precio)}</small>}
                        {clp(unit)}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>-</button>
                        {item.cantidad}
                        <button className="btn btn-sm btn-outline-secondary ms-1" disabled={item.cantidad >= item.stock} onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                      </td>
                      <td>{clp(unit * item.cantidad)}</td>
                      <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>Eliminar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Resumen</h4>
            {cartResumen.ahorroOfertas > 0 && (
              <div className="d-flex justify-content-between text-success mb-2"><span>Ahorro por ofertas:</span><span>-{clp(cartResumen.ahorroOfertas)}</span></div>
            )}
            <div className="d-flex justify-content-between mb-2"><span>Subtotal:</span><span>{clp(cartResumen.subtotal)}</span></div>
            {cartResumen.porcentaje > 0 && (
              <div className="d-flex justify-content-between text-success mb-2"><span>Descuento cliente ({cartResumen.porcentaje}%):</span><span>-{clp(cartResumen.descuento)}</span></div>
            )}
            {!currentUser && <p className="small text-muted">Inicia sesión para aplicar tus beneficios.</p>}
            <div className="d-flex justify-content-between fs-5 fw-bold mb-3 border-top pt-2"><span>Total:</span><span>{clp(cartResumen.total)}</span></div>
            <button className="btn btn-success w-100 fw-bold" onClick={() => setCurrentView('checkout')}>Proceder al Pago</button>
          </div>
        </div>
      </div>
    </div>
  );
};
