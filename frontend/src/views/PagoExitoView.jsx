import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const PagoExitoView = () => {
  const { lastOrder, setCurrentView } = useContext(StoreContext);

  if (!lastOrder) return null;

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: '750px' }}>
        <div className="alert alert-success text-center">
          <h4 className="alert-heading fw-bold">🎉 ¡Compra Realizada con Éxito!</h4>
          <p className="mb-0">Orden N°: <strong>#{lastOrder.id || '20261008'}</strong></p>
        </div>

        <h5 className="fw-bold mt-3">Detalle del Despacho</h5>
        <p className="mb-1"><strong>Cliente:</strong> {lastOrder.cliente?.nombre || lastOrder.nombre}</p>
        <p className="mb-1"><strong>Correo:</strong> {lastOrder.cliente?.correo || lastOrder.correo}</p>
        <p className="mb-3">
          <strong>Dirección:</strong> {lastOrder.direccion?.calle || lastOrder.calle},{' '}
          {lastOrder.direccion?.comuna || lastOrder.comuna}
        </p>

        <h5 className="fw-bold">Productos Adquiridos</h5>
        <ul className="list-group mb-3">
          {(lastOrder.items || []).map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.nombre}</strong> (x{item.cantidad})
              </div>
              <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
            </li>
          ))}
        </ul>

        <div className="text-end fs-5 fw-bold text-success mb-4">
          Total Pagado: ${lastOrder.total?.toLocaleString('es-CL')}
        </div>

        <button className="btn btn-primary w-100" onClick={() => setCurrentView('home')}>
          Volver a la Tienda
        </button>
      </div>
    </div>
  );
};
