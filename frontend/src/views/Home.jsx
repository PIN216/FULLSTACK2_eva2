import React, { useState, useEffect, useContext } from 'react';
import { DataService } from '../data/dataService';
import { StoreContext } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [productos, setProductos] = useState([]);
  const { addToCart, setSelectedProductId, setCurrentView } = useContext(StoreContext);

  useEffect(() => {
    setProductos(DataService.getProductos());
  }, []);

  const handleSelect = (id) => {
    setSelectedProductId(id);
    setCurrentView('detalle_producto');
  };

  return (
    <div className="container py-4">
      <div className="p-5 mb-4 bg-white rounded-3 shadow-sm border border-warning text-center">
        <h1 className="display-5 fw-bold brand-font text-brown">Celebrando 50 Años de Dulzura</h1>
        <p className="lead mx-auto" style={{ maxWidth: '750px' }}>
          Desde nuestro Record Guinness en 1995 hasta hoy, llevamos la mejor repostería chilena a tu hogar con apoyo a jóvenes talentos gastronómicos.
        </p>
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"
          alt="Torta artesanal"
          className="img-fluid rounded mt-3 shadow-sm"
          style={{ maxHeight: '320px', width: '100%', objectFit: 'cover' }}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-brown">Catálogo Destacado</h2>
        <span className="text-muted">{productos.length} productos disponibles</span>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {productos.map((prod) => (
          <div className="col" key={prod.id}>
            <ProductCard
              producto={prod}
              onAddToCart={addToCart}
              onSelect={handleSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
