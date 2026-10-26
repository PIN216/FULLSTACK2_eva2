import React, { useState, useEffect } from 'react';
import { CategoriaService } from '../../services/categoriaService';

export const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    CategoriaService.getCategorias().then(setCategorias);
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevaCat.nombre.trim()) return;
    try {
      const creada = await CategoriaService.createCategoria({
        nombre: nuevaCat.nombre.trim(),
        descripcion: nuevaCat.descripcion.trim()
      });
      setCategorias([...categorias, creada]);
      setNuevaCat({ nombre: '', descripcion: '' });
      setError('');
    } catch (err) {
      setError(err.status === 409 ? 'Ya existe una categoría con ese nombre.' : 'No se pudo guardar la categoría.');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await CategoriaService.deleteCategoria(id);
      setCategorias(categorias.filter(c => c.id !== id));
      setError('');
    } catch {
      setError('No se pudo eliminar la categoría.');
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Gestión de Categorías</h5>
      {error && <div className="alert alert-danger py-2">{error}</div>}
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
