import React, { useState, useEffect } from 'react';
import { OrdenService } from '../../services/ordenService';

export const HistorialCompras = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    setOrdenes(OrdenService.getOrdenes());
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Historial de Compras</h5>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Fecha</th></tr></thead>
          <tbody>
            {ordenes.map(o => (
              <tr key={o.id}>
                <td className="fw-bold">{o.id}</td>
                <td>{o.cliente?.nombre || 'Cliente'}</td>
                <td>${o.total?.toLocaleString('es-CL')}</td>
                <td><small>{o.fecha ? new Date(o.fecha).toLocaleDateString() : 'Reciente'}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
