import React, { useState, useEffect, useContext } from 'react';
import { DataService } from '../data/dataService';
import { StoreContext } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const OfertasView = () => {
  const [ofertas, setOfertas] = useState([]);
  const { addToCart, setSelectedProductId, setCurrentView } = useContext(StoreContext);

  useEffect(() => {
    const list = DataService.getProductos().filter((p) => p.enOferta);
    setOfertas(list);
  }, []);

  return (
    <div className="container py-4">
      <div className="alert alert-warning text-center shadow-sm mb-4">
        <h4 className="fw-bold mb-1">🔥 Promociones Especiales de Aniversario</h4>
        <p className="mb-0">Aprovecha hasta un 15% de descuento en variedades seleccionadas.</p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {ofertas.map((prod) => (
          <div className="col" key={prod.id}>
            <ProductCard
              producto={prod}
              onAddToCart={addToCart}
              onSelect={(id) => {
                setSelectedProductId(id);
                setCurrentView('detalle_producto');
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
