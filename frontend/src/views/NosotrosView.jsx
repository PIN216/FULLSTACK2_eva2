import React from 'react';

export const NosotrosView = () => (
  <div className="container py-5">
    <div className="card shadow-sm border-0 p-5">
      <h2 className="fw-bold text-brown brand-font mb-4">Sobre Nosotros - Pastelería Mil Sabores</h2>
      <p className="lead">
        Con más de 50 años de trayectoria, nos hemos consolidado como un referente de la repostería tradicional chilena, combinando recetas familiares con la innovación de nuevos talentos gastronómicos.
      </p>
      <div className="row mt-4 g-4">
        <div className="col-md-6">
          <div className="p-4 bg-light rounded h-100">
            <h5 className="fw-bold text-brown"><i className="bi bi-heart-fill text-danger me-2"></i>Nuestra Misión</h5>
            <p className="text-muted mb-0">Llevar dulzura, calidad y tradición a cada hogar de Chile en cada celebración con productos frescos y recetas auténticas.</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-4 bg-light rounded h-100">
            <h5 className="fw-bold text-brown"><i className="bi bi-star-fill text-warning me-2"></i>Nuestra Visión</h5>
            <p className="text-muted mb-0">Ser la pastelería líder reconocida por la excelencia artesanal, la inclusión alimentaria (opciones sin azúcar y sin gluten) y el compromiso con nuestros clientes.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

