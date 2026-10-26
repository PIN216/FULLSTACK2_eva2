import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const PagoExitoView = () => {
  const { lastOrder, setCurrentView } = useContext(StoreContext);

  if (!lastOrder) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info">No hay una compra reciente que mostrar.</div>
        <button className="btn btn-primary" onClick={() => setCurrentView('home')}>Volver a la Tienda</button>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center">
      <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
        <div className="alert alert-success">🎉 ¡Compra realizada con éxito! Orden #{lastOrder.id}</div>
        <h5>Total pagado: ${lastOrder.total?.toLocaleString('es-CL')}</h5>
        <button className="btn btn-primary mt-3" onClick={() => setCurrentView('home')}>Volver a la Tienda</button>
      </div>
    </div>
  );
};
