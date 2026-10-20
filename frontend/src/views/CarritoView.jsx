import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const CarritoView = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, setCurrentView } = useContext(StoreContext);

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
                {cart.map(item => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>-</button>
                      {item.cantidad}
                      <button className="btn btn-sm btn-outline-secondary ms-1" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
                    </td>
                    <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Resumen</h4>
            <div className="d-flex justify-content-between fs-5 fw-bold mb-3"><span>Total:</span><span>${cartTotal.toLocaleString('es-CL')}</span></div>
            <button className="btn btn-success w-100 fw-bold" onClick={() => setCurrentView('checkout')}>Proceder al Pago</button>
          </div>
        </div>
      </div>
    </div>
  );
};
