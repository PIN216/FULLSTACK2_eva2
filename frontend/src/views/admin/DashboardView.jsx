import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { ProductoService } from '../../services/productoService';
import { CategoriaService } from '../../services/categoriaService';
import { MostrarBoleta } from '../../components/admin/MostrarBoleta';
import { ProductosCriticos } from '../../components/admin/ProductosCriticos';
import { AdminCategorias } from '../../components/admin/AdminCategorias';
import { AdminUsuarios } from '../../components/admin/AdminUsuarios';
import { HistorialCompras } from '../../components/admin/HistorialCompras';
import { AdminReportes } from '../../components/admin/AdminReportes';

const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600';
const FORM_VACIO = { id: null, nombre: '', categoria: '', precio: '', stock: '', descripcion: '', imagen: '', enOferta: false, descuento: '' };

export const DashboardView = () => {
  const { currentUser, setCurrentView } = useContext(StoreContext);
  const esAdmin = currentUser?.rol === 'admin';

  const [productos, setProductos] = useState([]);
  const [categorias] = useState(() => CategoriaService.getCategorias());
  const [form, setForm] = useState({ ...FORM_VACIO, categoria: categorias[0]?.nombre || '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (esAdmin) ProductoService.getProductos().then(setProductos);
  }, [esAdmin]);

  // Vista protegida (RF-06): solo el rol admin entra.
  if (!esAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">Acceso restringido: necesitas una cuenta de administrador.</div>
        <button className="btn btn-primary" onClick={() => setCurrentView(currentUser ? 'home' : 'login')}>
          {currentUser ? 'Volver al inicio' : 'Iniciar sesión'}
        </button>
      </div>
    );
  }

  const limpiar = () => { setForm({ ...FORM_VACIO, categoria: categorias[0]?.nombre || '' }); setError(''); };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const precio = Number(form.precio);
    const stock = Number(form.stock);
    const descuento = form.enOferta ? Number(form.descuento) : 0;
    if (!(precio > 0)) { setError('El precio debe ser mayor a 0.'); return; }
    if (!Number.isInteger(stock) || stock < 0) { setError('El stock debe ser un número entero mayor o igual a 0.'); return; }
    if (form.enOferta && !(descuento > 0 && descuento < 100)) { setError('El descuento debe estar entre 1 y 99.'); return; }

    const datos = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio, stock,
      descripcion: form.descripcion.trim(),
      imagen: form.imagen.trim() || IMAGEN_POR_DEFECTO,
      enOferta: form.enOferta,
      descuento
    };

    if (form.id !== null) {
      const actualizado = await ProductoService.updateProducto(form.id, datos);
      setProductos(productos.map(p => (p.id === form.id ? actualizado : p)));
    } else {
      const creado = await ProductoService.createProducto(datos);
      setProductos([...productos, creado]);
    }
    limpiar();
  };

  const handleEditar = (p) => {
    setError('');
    setForm({
      id: p.id, nombre: p.nombre || '', categoria: p.categoria || categorias[0]?.nombre || '',
      precio: String(p.precio ?? ''), stock: String(p.stock ?? ''), descripcion: p.descripcion || '',
      imagen: p.imagen || '', enOferta: !!p.enOferta, descuento: p.descuento ? String(p.descuento) : ''
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    await ProductoService.deleteProducto(id);
    setProductos(productos.filter(p => p.id !== id));
    if (form.id === id) limpiar();
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-brown mb-4">Panel de Administración</h2>

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
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleGuardar} className="row g-2 mb-4">
          <div className="col-md-3"><input type="text" className="form-control" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
          <div className="col-md-3">
            <select className="form-select" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required>
              {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="col-md-2"><input type="number" min="1" className="form-control" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required /></div>
          <div className="col-md-2"><input type="number" min="0" className="form-control" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required /></div>
          <div className="col-md-2 d-flex align-items-center">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chkOferta" checked={form.enOferta} onChange={e => setForm({...form, enOferta: e.target.checked})} />
              <label className="form-check-label" htmlFor="chkOferta">En oferta</label>
            </div>
          </div>
          <div className="col-md-6"><input type="text" className="form-control" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
          <div className="col-md-4"><input type="url" className="form-control" placeholder="URL de imagen (opcional)" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} /></div>
          <div className="col-md-2">
            <input type="number" min="1" max="99" className="form-control" placeholder="% dcto" disabled={!form.enOferta} value={form.descuento} onChange={e => setForm({...form, descuento: e.target.value})} />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary-custom">{form.id !== null ? 'Actualizar producto' : 'Guardar producto'}</button>
            {form.id !== null && <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Cancelar edición</button>}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Oferta</th><th>Stock</th><th>Acción</th></tr></thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="fw-bold">{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${Number(p.precio || 0).toLocaleString('es-CL')}</td>
                  <td>{p.enOferta ? <span className="badge bg-danger">-{p.descuento}%</span> : '—'}</td>
                  <td><span className={`badge ${p.stock < 6 ? 'bg-danger' : 'bg-success'}`}>{p.stock} un.</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(p)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
