import React, { useState, useEffect } from 'react';
import { CategoriaService } from '../../services/categoriaService';

export const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    setCategorias(CategoriaService.getCategorias());
  }, []);

  const handleCrear = (e) => {
    e.preventDefault();
    if (!nuevaCat.nombre) return;
    const creada = CategoriaService.createCategoria(nuevaCat);
    setCategorias([...categorias, creada]);
    setNuevaCat({ nombre: '', descripcion: '' });
  };

  const handleEliminar = (id) => {
    CategoriaService.deleteCategoria(id);
    setCategorias(categorias.filter(c => c.id !== id));
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Gestión de Categorías</h5>
      <form onSubmit={handleCrear} className="row g-2 mb-3">
        <div className="col-md-5"><input type="text" className="form-control" placeholder="Nombre Categoría" value={nuevaCat.nombre} onChange={e => setNuevaCat({...nuevaCat, nombre: e.target.value})} required /></div>
        <div className="col-md-5"><input type="text" className="form-control" placeholder="Descripción" value={nuevaCat.descripcion} onChange={e => setNuevaCat({...nuevaCat, descripcion: e.target.value})} /></div>
        <div className="col-md-2"><button type="submit" className="btn btn-primary-custom w-100">Agregar</button></div>
      </form>
      <ul className="list-group">
        {categorias.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div><strong>{c.nombre}</strong> - <small className="text-muted">{c.descripcion}</small></div>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
