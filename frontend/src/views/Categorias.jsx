import React, { useState, useEffect, useContext } from 'react';
import { CategoriaService } from '../services/categoriaService';
import { ProductoService } from '../services/productoService';
import { StoreContext } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCat, setSelectedCat] = useState('Todas');
  const { addToCart, setSelectedProductId, setCurrentView } = useContext(StoreContext);

  useEffect(() => {
    CategoriaService.getCategorias().then(setCategorias);
    ProductoService.getProductos().then(setProductos);
  }, []);

  const filtered = selectedCat === 'Todas' ? productos : productos.filter(p => p.categoria === selectedCat);

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-brown mb-4">Categorías de Pastelería</h2>
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className={`btn ${selectedCat === 'Todas' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedCat('Todas')}>Todas</button>
        {categorias.map(cat => (
          <button key={cat.id} className={`btn ${selectedCat === cat.nombre ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setSelectedCat(cat.nombre)}>{cat.nombre}</button>
        ))}
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {filtered.map(prod => (
          <div className="col" key={prod.id}>
            <ProductCard producto={prod} onAddToCart={addToCart} onSelect={(id) => { setSelectedProductId(id); setCurrentView('detalle_producto'); }} />
          </div>
        ))}
      </div>
    </div>
  );
};
