import React, { useState } from 'react';
import { OrdenService } from '../../services/ordenService';

export const MostrarBoleta = () => {
  const [ordenId, setOrdenId] = useState('');
  const [orden, setOrden] = useState(null);

  const handleBuscar = (e) => {
    e.preventDefault();
    setOrden(OrdenService.getOrdenById(ordenId) || null);
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Mostrar Boleta / Orden</h5>
      <form onSubmit={handleBuscar} className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Ej: ORD-123456" value={ordenId} onChange={e => setOrdenId(e.target.value)} />
        <button className="btn btn-outline-primary" type="submit">Buscar</button>
      </form>
      {orden && (
        <div className="bg-light p-3 rounded">
          <p className="mb-1"><strong>ID Orden:</strong> {orden.id}</p>
          <p className="mb-1"><strong>Cliente:</strong> {orden.cliente?.nombre}</p>
          <p className="mb-0"><strong>Total:</strong> ${orden.total?.toLocaleString('es-CL')}</p>
        </div>
      )}
    </div>
  );
};
