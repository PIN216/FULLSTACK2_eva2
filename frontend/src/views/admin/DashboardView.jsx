import React, { useState, useEffect } from 'react';
import { ProductoService } from '../../services/productoService';
import { MostrarBoleta } from '../../components/admin/MostrarBoleta';
import { ProductosCriticos } from '../../components/admin/ProductosCriticos';
import { AdminCategorias } from '../../components/admin/AdminCategorias';
import { AdminUsuarios } from '../../components/admin/AdminUsuarios';
import { HistorialCompras } from '../../components/admin/HistorialCompras';
import { AdminReportes } from '../../components/admin/AdminReportes';

export const DashboardView = () => {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', categoria: 'Tortas Cuadradas', precio: '', stock: '', descripcion: '' });

  useEffect(() => {
    ProductoService.getProductos().then(setProductos);
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    const p = await ProductoService.createProducto({ ...nuevo, precio: Number(nuevo.precio), stock: Number(nuevo.stock) || 1, imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600" });
    setProductos([...productos, p]);
    setNuevo({ nombre: '', categoria: 'Tortas Cuadradas', precio: '', stock: '', descripcion: '' });
  };

  const handleEliminar = async (id) => {
    await ProductoService.deleteProducto(id);
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-brown mb-4">Panel de Administración (Figura 10)</h2>
      
      <div className="row">
        <div className="col-lg-6">
          <MostrarBoleta />
          <ProductosCriticos />
          <AdminCategorias />
        </div>
        <div className="col-lg-6">
          <AdminReportes />
          <AdminUsuarios />
          <HistorialCompras />
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4 mt-2">
        <h5 className="fw-bold text-brown mb-3">Gestión de Productos</h5>
        <form onSubmit={handleCrear} className="row g-2 mb-4">
          <div className="col-md-3"><input type="text" className="form-control" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} required /></div>
          <div className="col-md-3">
            <select className="form-select" value={nuevo.categoria} onChange={e => setNuevo({...nuevo, categoria: e.target.value})}>
              <option value="Tortas Cuadradas">Tortas Cuadradas</option>
              <option value="Tortas Circulares">Tortas Circulares</option>
              <option value="Sin Azúcar">Sin Azúcar</option>
              <option value="Sin Gluten">Sin Gluten</option>
            </select>
          </div>
          <div className="col-md-2"><input type="number" className="form-control" placeholder="Precio" value={nuevo.precio} onChange={e => setNuevo({...nuevo, precio: e.target.value})} required /></div>
          <div className="col-md-2"><input type="number" className="form-control" placeholder="Stock" value={nuevo.stock} onChange={e => setNuevo({...nuevo, stock: e.target.value})} /></div>
          <div className="col-md-2"><button type="submit" className="btn btn-primary-custom w-100">Guardar</button></div>
        </form>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acción</th></tr></thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio?.toLocaleString('es-CL')}</td>
                  <td><span className={`badge ${p.stock < 6 ? 'bg-danger' : 'bg-success'}`}>{p.stock} un.</span></td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(p.id)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
