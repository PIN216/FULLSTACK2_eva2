import React, { useState, useEffect } from 'react';
import { DataService } from '../../data/dataService';

export const DashboardView = () => {
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [nuevoProd, setNuevoProd] = useState({
    nombre: '',
    categoria: 'Tortas Cuadradas',
    precio: '',
    stock: '',
    descripcion: ''
  });

  useEffect(() => {
    setProductos(DataService.getProductos());
    setOrdenes(DataService.getOrdenes());
  }, []);

  const totalVentas = ordenes.reduce((acc, o) => acc + (o.total || 0), 0);

  const handleCrear = (e) => {
    e.preventDefault();
    if (!nuevoProd.nombre || !nuevoProd.precio) return;
    const creado = DataService.createProducto({
      ...nuevoProd,
      precio: Number(nuevoProd.precio),
      stock: Number(nuevoProd.stock) || 1,
      imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
    });
    setProductos([...productos, creado]);
    setNuevoProd({ nombre: '', categoria: 'Tortas Cuadradas', precio: '', stock: '', descripcion: '' });
  };

  const handleEliminar = (id) => {
    DataService.deleteProducto(id);
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="fw-bold text-brown">Panel de Administración - Dashboard</h2>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white p-3 shadow-sm border-0">
            <h5>Compras Realizadas</h5>
            <h2 className="fw-bold">{ordenes.length}</h2>
            <small>Total recaudado: ${totalVentas.toLocaleString('es-CL')}</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white p-3 shadow-sm border-0">
            <h5>Productos Registrados</h5>
            <h2 className="fw-bold">{productos.length}</h2>
            <small>En catálogo disponible</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark p-3 shadow-sm border-0">
            <h5>Productos Críticos</h5>
            <h2 className="fw-bold">{productos.filter((p) => p.stock < 6).length}</h2>
            <small>Stock menor a 6 unidades</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm p-4 border-0">
            <h5 className="fw-bold mb-3 text-brown">Agregar Nuevo Producto</h5>
            <form onSubmit={handleCrear}>
              <div className="mb-2">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoProd.nombre}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={nuevoProd.categoria}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, categoria: e.target.value })}
                >
                  <option value="Tortas Cuadradas">Tortas Cuadradas</option>
                  <option value="Tortas Circulares">Tortas Circulares</option>
                  <option value="Sin Azúcar">Sin Azúcar</option>
                  <option value="Sin Gluten">Sin Gluten</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Precio ($ CLP)</label>
                <input
                  type="number"
                  className="form-control"
                  value={nuevoProd.precio}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, precio: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={nuevoProd.stock}
                  onChange={(e) => setNuevoProd({ ...nuevoProd, stock: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary-custom w-100 mt-2">
                Guardar Producto
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm p-3 border-0">
            <h5 className="fw-bold mb-3 text-brown">Inventario Actual</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>${p.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <span className={`badge ${p.stock < 6 ? 'bg-danger' : 'bg-success'}`}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(p.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
