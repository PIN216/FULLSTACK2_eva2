import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { ProductoService } from '../../services/productoService';
import { OrdenService } from '../../services/ordenService';
import { ApiService } from '../../services/api';

/**
 * Vista de Vendedor (Evaluación Parcial 3 - Requisito de Roles).
 * Permite a los usuarios con rol 'VENDEDOR':
 * 1. Visualizar la lista de productos y sus detalles.
 * 2. Visualizar la lista de órdenes/boletas y su desglose detallado.
 * 3. Garantiza que cualquier otra funcionalidad administrativa (categorías, usuarios, eliminación)
 *    no esté visible ni disponible.
 */
export const VendedorView = () => {
  const { currentUser, isVendedor, isAdmin, setCurrentView } = useContext(StoreContext);

  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'ordenes'
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [busquedaProd, setBusquedaProd] = useState('');
  const [busquedaOrden, setBusquedaOrden] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Formateador de moneda en pesos chilenos
  const clp = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`;

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const prods = await ProductoService.getProductos();
        setProductos(prods || []);
      } catch {
        setProductos([]);
      }

      try {
        // Cargar órdenes mediante el servicio con respaldo en API/local
        let ords = [];
        if (ApiService.getOrdenes) {
          ords = await ApiService.getOrdenes();
        } else {
          ords = OrdenService.getOrdenes();
        }
        setOrdenes(ords || []);
      } catch {
        setOrdenes(OrdenService.getOrdenes() || []);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Control de acceso: Solo Vendedor o Administrador pueden visualizar este panel
  if (!isVendedor && !isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="text-danger fs-1 mb-3">
            <i className="bi bi-shield-x"></i> 🔒
          </div>
          <h3 className="fw-bold text-danger mb-3">Acceso Restringido</h3>
          <p className="text-muted">
            Esta interfaz está reservada exclusivamente para personal con rol de <strong>Vendedor</strong> o <strong>Administrador</strong>.
          </p>
          <div className="mt-4">
            <button className="btn btn-primary" onClick={() => setCurrentView('home')}>
              Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtros de búsqueda
  const productosFiltrados = productos.filter((p) =>
    (p.nombre || '').toLowerCase().includes(busquedaProd.toLowerCase()) ||
    (p.categoria || '').toLowerCase().includes(busquedaProd.toLowerCase())
  );

  const ordenesFiltradas = ordenes.filter((o) =>
    (o.id || '').toLowerCase().includes(busquedaOrden.toLowerCase()) ||
    (o.cliente?.nombre || o.clienteNombre || '').toLowerCase().includes(busquedaOrden.toLowerCase()) ||
    (o.cliente?.correo || o.clienteCorreo || '').toLowerCase().includes(busquedaOrden.toLowerCase())
  );

  return (
    <div className="container py-4">
      {/* Encabezado del Panel de Vendedor */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <span className="badge bg-warning text-dark px-3 py-2 fs-6 mb-2">
            Rol: VENDEDOR AUTORIZADO
          </span>
          <h2 className="fw-bold text-brown mb-0">🍰 Panel de Ventas y Atención al Cliente</h2>
          <small className="text-muted">
            Bienvenido, <strong>{currentUser?.nombre || 'Vendedor'}</strong> ({currentUser?.correo}).
          </small>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-outline-secondary" onClick={() => setCurrentView('home')}>
            <i className="bi bi-shop me-1"></i> Ir al Catálogo Público
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Operativo */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-primary h-100">
            <div className="card-body">
              <span className="text-muted small text-uppercase fw-bold">Productos Disponibles</span>
              <h3 className="fw-bold text-primary mb-0">{productos.length}</h3>
              <small className="text-muted">Catálogo activo</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-4 border-success h-100">
            <div className="card-body">
              <span className="text-muted small text-uppercase fw-bold">Órdenes / Boletas</span>
              <h3 className="fw-bold text-success mb-0">{ordenes.length}</h3>
              <small className="text-muted">Transacciones emitidas</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-6">
          <div className="card shadow-sm border-0 border-start border-4 border-info h-100 bg-light">
            <div className="card-body">
              <span className="text-info fw-bold small text-uppercase">Política de Permisos (Rol Vendedor)</span>
              <p className="mb-0 small text-muted">
                Tienes acceso de <strong>lectura y consulta de catálogo y órdenes</strong>. Las modificaciones,
                creación de productos y gestión de usuarios son exclusivas del Administrador.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación de Vendedor */}
      <ul className="nav nav-pills mb-4 border-bottom pb-3">
        <li className="nav-item me-2">
          <button
            className={`nav-link px-4 ${activeTab === 'productos' ? 'active bg-primary' : 'bg-light text-dark'}`}
            onClick={() => setActiveTab('productos')}
          >
            📦 Catálogo de Productos ({productos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 ${activeTab === 'ordenes' ? 'active bg-primary' : 'bg-light text-dark'}`}
            onClick={() => setActiveTab('ordenes')}
          >
            🧾 Órdenes y Boletas ({ordenes.length})
          </button>
        </li>
      </ul>

      {/* CONTENIDO PESTAÑA 1: PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h4 className="fw-bold text-brown mb-0">Lista de Productos</h4>
            <div style={{ maxWidth: '300px', width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o categoría..."
                value={busquedaProd}
                onChange={(e) => setBusquedaProd(e.target.value)}
              />
            </div>
          </div>

          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Cargando catálogo...</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="alert alert-info text-center py-4">No se encontraron productos coincidentes.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Oferta</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold text-muted">#{p.id}</td>
                      <td>
                        <img
                          src={p.imagen || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'}
                          alt={p.nombre}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </td>
                      <td className="fw-semibold">{p.nombre}</td>
                      <td><span className="badge bg-secondary">{p.categoria}</span></td>
                      <td className="fw-bold text-brown">{clp(p.precio)}</td>
                      <td>
                        <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                          {p.stock} unid.
                        </span>
                      </td>
                      <td>
                        {p.enOferta ? (
                          <span className="badge bg-danger">-{p.descuento}% OFF</span>
                        ) : (
                          <span className="badge bg-light text-muted">Normal</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setProductoSeleccionado(p)}
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: ÓRDENES / BOLETAS */}
      {activeTab === 'ordenes' && (
        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h4 className="fw-bold text-brown mb-0">Historial de Órdenes y Boletas</h4>
            <div style={{ maxWidth: '300px', width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por N° boleta o cliente..."
                value={busquedaOrden}
                onChange={(e) => setBusquedaOrden(e.target.value)}
              />
            </div>
          </div>

          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Cargando órdenes...</p>
            </div>
          ) : ordenesFiltradas.length === 0 ? (
            <div className="alert alert-info text-center py-4">No se han registrado órdenes aún.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>N° Orden / Boleta</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Comuna</th>
                    <th>Total</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.map((o) => (
                    <tr key={o.id}>
                      <td className="fw-bold text-primary">{o.id}</td>
                      <td>{o.fecha ? new Date(o.fecha).toLocaleDateString('es-CL') : 'Reciente'}</td>
                      <td>
                        <div className="fw-semibold">{o.cliente?.nombre || o.clienteNombre || 'Cliente'}</div>
                        <small className="text-muted">{o.cliente?.correo || o.clienteCorreo || ''}</small>
                      </td>
                      <td>{o.direccion?.comuna || o.direccionComuna || 'No especificada'}</td>
                      <td className="fw-bold text-success fs-6">{clp(o.total)}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => setOrdenSeleccionada(o)}
                        >
                          Ver Boleta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL / VISTA DE DETALLE DE PRODUCTO */}
      {productoSeleccionado && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-brown">Detalle del Producto</h5>
                <button type="button" className="btn-close" onClick={() => setProductoSeleccionado(null)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img
                    src={productoSeleccionado.imagen || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'}
                    alt={productoSeleccionado.nombre}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
                <h4 className="fw-bold text-brown">{productoSeleccionado.nombre}</h4>
                <p className="text-muted">{productoSeleccionado.descripcion}</p>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Categoría:</span>
                    <strong>{productoSeleccionado.categoria}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Precio Unitario:</span>
                    <strong>{clp(productoSeleccionado.precio)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Stock Disponible:</span>
                    <strong className={productoSeleccionado.stock <= 5 ? 'text-danger' : 'text-success'}>
                      {productoSeleccionado.stock} unidades
                    </strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Estado Comercial:</span>
                    <span>
                      {productoSeleccionado.enOferta ? (
                        <span className="badge bg-danger">En Oferta (-{productoSeleccionado.descuento}%)</span>
                      ) : (
                        <span className="badge bg-secondary">Precio Normal</span>
                      )}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary w-100" onClick={() => setProductoSeleccionado(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / VISTA DE DETALLE DE BOLETA */}
      {ordenSeleccionada && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-brown">
                  🧾 Boleta Electrónica: {ordenSeleccionada.id}
                </h5>
                <button type="button" className="btn-close" onClick={() => setOrdenSeleccionada(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted">Datos del Cliente:</h6>
                    <p className="mb-1"><strong>Nombre:</strong> {ordenSeleccionada.cliente?.nombre || ordenSeleccionada.clienteNombre}</p>
                    <p className="mb-0"><strong>Correo:</strong> {ordenSeleccionada.cliente?.correo || ordenSeleccionada.clienteCorreo}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted">Dirección de Despacho:</h6>
                    <p className="mb-1"><strong>Calle:</strong> {ordenSeleccionada.direccion?.calle || ordenSeleccionada.direccionCalle}</p>
                    <p className="mb-0"><strong>Comuna:</strong> {ordenSeleccionada.direccion?.comuna || ordenSeleccionada.direccionComuna}</p>
                  </div>
                </div>

                <h6 className="fw-bold text-muted mb-2">Desglose de Ítems Comprados:</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-bordered table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio Unit.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(ordenSeleccionada.items || []).map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.nombre}</td>
                          <td className="text-center">{it.cantidad}</td>
                          <td className="text-end">{clp(it.precio)}</td>
                          <td className="text-end fw-semibold">{clp(it.precio * it.cantidad)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end">
                  <div style={{ minWidth: '250px' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Subtotal:</span>
                      <span>{clp(ordenSeleccionada.subtotal)}</span>
                    </div>
                    {ordenSeleccionada.descuento > 0 && (
                      <div className="d-flex justify-content-between text-success mb-1">
                        <span>Descuento aplicado:</span>
                        <span>-{clp(ordenSeleccionada.descuento)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2 text-brown">
                      <span>Total Pagado:</span>
                      <span>{clp(ordenSeleccionada.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setOrdenSeleccionada(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorView;
