import React from 'react';

export const ProductCard = ({ producto, onAddToCart, onSelect }) => {
  return (
    <div className="card h-100 shadow-sm border-0 card-product">
      <img
        src={producto.imagen || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'}
        className="card-img-top"
        alt={producto.nombre}
        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => onSelect && onSelect(producto.id)}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-secondary">{producto.categoria}</span>
          {producto.enOferta && (
            <span className="badge bg-danger badge-oferta">-{producto.descuento}% OFF</span>
          )}
        </div>
        <h5 className="card-title fw-bold text-brown" style={{ cursor: 'pointer' }} onClick={() => onSelect && onSelect(producto.id)}>
          {producto.nombre}
        </h5>
        <p className="card-text text-muted small flex-grow-1">{producto.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold text-brown">${Number(producto.precio).toLocaleString('es-CL')}</span>
          <button
            className="btn btn-sm btn-primary-custom px-3"
            onClick={() => onAddToCart && onAddToCart(producto)}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};
