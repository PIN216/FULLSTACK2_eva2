import React from 'react';
import { ReporteService } from '../../services/reporteService';

export const AdminReportes = () => {
  const metricas = ReporteService.getResumenMetricas();

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Reportes Generales del Sistema</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="p-3 bg-light rounded border text-center">
            <h6>Órdenes Procesadas</h6>
            <h3 className="fw-bold text-primary">{metricas.compras}</h3>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 bg-light rounded border text-center">
            <h6>Ingresos Totales</h6>
            <h3 className="fw-bold text-success">${metricas.totalRecaudado.toLocaleString('es-CL')}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
