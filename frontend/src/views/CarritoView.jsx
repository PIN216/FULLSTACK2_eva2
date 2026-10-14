import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const CarritoView = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, setCurrentView } = useContext(StoreContext);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0">
          <h3 className="fw-bold">Tu carrito de compras está vacío 🛒</h3>
          <p className="text-muted">Explora nuestros productos y tortas artesanales de aniversario.</p>
          <div>
            <button className="btn btn-primary mt-3" onClick={() => setCurrentView('home')}>
              Ir al Catálogo
            </button>
          </div>
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
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th style={{ width: '130px' }}>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            style={{ width: '55px', height: '55px', objectFit: 'cover' }}
                            className="rounded"
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                            <small className="text-muted">{item.categoria}</small>
                          </div>
                        </div>
                      </td>
                      <td>${item.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <span className="input-group-text px-3">{item.cantidad}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Resumen de Compra</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${cartTotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Envío:</span>
              <span className="text-success fw-bold">Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
              <span>Total a pagar:</span>
              <span className="text-primary">${cartTotal.toLocaleString('es-CL')}</span>
            </div>
            <button className="btn btn-success w-100 py-2 fw-bold" onClick={() => setCurrentView('checkout')}>
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
