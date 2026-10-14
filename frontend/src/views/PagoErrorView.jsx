import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const PagoErrorView = () => {
  const { lastOrder, setCurrentView } = useContext(StoreContext);

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-danger p-4 mx-auto" style={{ maxWidth: '750px' }}>
        <div className="alert alert-danger text-center">
          <h4 className="alert-heading fw-bold">❌ No se pudo realizar el pago</h4>
          <p className="mb-0">La transacción fue rechazada por la entidad emisora.</p>
        </div>

        <div className="text-center my-3">
          <button className="btn btn-danger btn-lg px-4" onClick={() => setCurrentView('checkout')}>
            Volver a Realizar el Pago
          </button>
        </div>

        {lastOrder && (
          <div className="bg-light p-3 rounded mt-3">
            <h6 className="fw-bold">Resumen de la orden pendiente:</h6>
            <p className="mb-1">Cliente: {lastOrder.nombre} {lastOrder.apellidos}</p>
            <p className="mb-0">Monto retenido: ${lastOrder.total?.toLocaleString('es-CL')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
