import React, { useState, useEffect } from 'react';
import { ReporteService } from '../../services/reporteService';

export const ProductosCriticos = () => {
  const [criticos, setCriticos] = useState([]);

  useEffect(() => {
    ReporteService.getProductosCriticos().then(setCriticos);
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Listado de Productos Críticos (Stock &lt; 6)</h5>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead><tr><th>Nombre</th><th>Categoría</th><th>Stock</th></tr></thead>
          <tbody>
            {criticos.map(p => (
              <tr key={p.id}>
                <td className="fw-bold">{p.nombre}</td>
                <td>{p.categoria}</td>
                <td><span className="badge bg-danger">{p.stock} un.</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
