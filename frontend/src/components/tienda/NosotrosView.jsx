import React from 'react';

export const NosotrosView = () => (
  <div className="container py-5">
    <div className="card shadow-sm border-0 p-5">
      <h2 className="fw-bold text-brown brand-font mb-4">Sobre Nosotros - Pastelería Mil Sabores</h2>
      <p className="lead">
        Con más de 50 años de trayectoria, nos hemos consolidado como un referente de la repostería tradicional chilena, combinando recetas familiares con la innovación de nuevos talentos gastronómicos.
      </p>
      <div className="row mt-4">
        <div className="col-md-6">
          <h5 className="fw-bold text-brown">Nuestra Misión</h5>
          <p className="text-muted">Llevar dulzura, calidad y tradición a cada hogar de Chile en cada celebración.</p>
        </div>
        <div className="col-md-6">
          <h5 className="fw-bold text-brown">Nuestra Visión</h5>
          <p className="text-muted">Ser la pastelería líder reconocida por la excelencia artesanal y el compromiso social.</p>
        </div>
      </div>
    </div>
  </div>
);
