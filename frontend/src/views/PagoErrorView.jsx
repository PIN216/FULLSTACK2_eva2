import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const PagoErrorView = () => {
  const { setCurrentView } = useContext(StoreContext);
  return (
    <div className="container py-5 text-center">
      <div className="card shadow-sm border-danger p-5 mx-auto" style={{ maxWidth: '600px' }}>
        <div className="alert alert-danger">❌ No se pudo realizar el pago. Transacción rechazada.</div>
        <button className="btn btn-danger mt-3" onClick={() => setCurrentView('checkout')}>Reintentar Pago</button>
      </div>
    </div>
  );
};
