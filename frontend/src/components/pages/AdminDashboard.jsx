import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { ProductoService } from '../../services/productoService';
import { OrdenService } from '../../services/ordenService';
import { UsuarioService } from '../../services/usuarioService';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const { setCurrentView, logout, currentUser } = useContext(StoreContext);
  const [numProductos, setNumProductos] = useState(0);
  const [numOrdenes, setNumOrdenes] = useState(0);
  const [numUsuarios, setNumUsuarios] = useState(0);

  useEffect(() => {
    ProductoService.getProductos().then(prods => setNumProductos(prods.length)).catch(() => {});
    const ords = OrdenService.getOrdenes();
    setNumOrdenes(ords.length);
    UsuarioService.getUsuarios().then(us => setNumUsuarios(us.length)).catch(() => {});
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* --- SIDEBAR / BARRA LATERAL (Figura 9 del documento) --- */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse p-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 mt-2 mb-3 text-muted fw-bold">
              🍰 Mil Sabores
            </h5>
            <ul className="nav flex-column mb-4">
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link active bg-primary text-white rounded fw-semibold btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_panel')}
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </button>
              </li>
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link text-dark btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_dashboard')}
                >
                  <i className="bi bi-cart me-2"></i> Órdenes
                </button>
              </li>
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link text-dark btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_dashboard')}
                >
                  <i className="bi bi-box-seam me-2"></i> Productos
                </button>
              </li>
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link text-dark btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_dashboard')}
                >
                  <i className="bi bi-tags me-2"></i> Categorías
                </button>
              </li>
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link text-dark btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_dashboard')}
                >
                  <i className="bi bi-people me-2"></i> Usuarios
                </button>
              </li>
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link text-dark btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_dashboard')}
                >
                  <i className="bi bi-bar-chart me-2"></i> Reportes
                </button>
              </li>
            </ul>

            <hr />

            <ul className="nav flex-column mb-3">
              <li className="nav-item mb-1">
                <button
                  type="button"
                  className="nav-link text-dark btn btn-link text-start w-100"
                  onClick={() => setCurrentView('admin_dashboard')}
                >
                  <i className="bi bi-person me-2"></i> Perfil ({currentUser?.nombre || 'Admin'})
                </button>
              </li>
            </ul>

            <div className="d-grid gap-2 mt-4">
              <button
                type="button"
                className="btn btn-dark text-white fw-bold py-2"
                onClick={() => setCurrentView('home')}
              >
                <i className="bi bi-shop me-2"></i> Tienda
              </button>
              <button
                type="button"
                className="btn btn-danger text-white fw-bold py-2"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>

        {/* --- CONTENIDO PRINCIPAL / MAIN DASHBOARD --- */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h1 className="h2 fw-bold">Dashboard</h1>
              <p className="text-muted mb-0">Resumen de las actividades diarias del sistema</p>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary fw-bold"
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <i className="bi bi-gear-fill me-2"></i> Ir a Gestión Operativa (CRUD / Boletas)
              </button>
            </div>
          </div>

          {/* TARJETAS SUPERIORES DE MÉTRICAS / METRIC CARDS */}
          <div className="row g-3 mb-4">
            {/* Tarjeta Compras */}
            <div className="col-md-4">
              <div
                className="card bg-primary text-white shadow-sm border-0 h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Compras</h6>
                    <h2 className="display-6 fw-bold mb-0">{numOrdenes > 0 ? numOrdenes : '1,234'}</h2>
                    <small className="opacity-75">Probabilidad de aumento: 20%</small>
                  </div>
                  <i className="bi bi-cart-check fs-1"></i>
                </div>
              </div>
            </div>

            {/* Tarjeta Productos */}
            <div className="col-md-4">
              <div
                className="card bg-success text-white shadow-sm border-0 h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Productos</h6>
                    <h2 className="display-6 fw-bold mb-0">{numProductos > 0 ? numProductos : '400'}</h2>
                    <small className="opacity-75">Inventario activo en catálogo</small>
                  </div>
                  <i className="bi bi-box-seam fs-1"></i>
                </div>
              </div>
            </div>

            {/* Tarjeta Usuarios */}
            <div className="col-md-4">
              <div
                className="card bg-warning text-dark shadow-sm border-0 h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Usuarios</h6>
                    <h2 className="display-6 fw-bold mb-0">{numUsuarios > 0 ? numUsuarios : '890'}</h2>
                    <small className="opacity-75">Cuentas registradas en el sistema</small>
                  </div>
                  <i className="bi bi-people fs-1"></i>
                </div>
              </div>
            </div>
          </div>

          {/* GRILLA DE ACCESOS RÁPIDOS / GRID DE MÓDULOS */}
          <div className="row g-3">
            {/* Módulo Dashboard */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_panel')}
              >
                <div className="card-body">
                  <i className="bi bi-speedometer2 text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Dashboard</h5>
                  <p className="card-text text-muted small">
                    Visión general de todas las métricas y estadísticas clave del sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Órdenes */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body">
                  <i className="bi bi-cart text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Órdenes</h5>
                  <p className="card-text text-muted small">
                    Gestión y seguimiento de todas las órdenes de compra realizadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Productos */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body">
                  <i className="bi bi-box-seam text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Productos</h5>
                  <p className="card-text text-muted small">
                    Administrar inventario y detalles de los productos disponibles.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Categorías */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body">
                  <i className="bi bi-tags text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Categorías</h5>
                  <p className="card-text text-muted small">
                    Organizar productos en categorías para facilitar su navegación.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Usuarios */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body">
                  <i className="bi bi-people text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Usuarios</h5>
                  <p className="card-text text-muted small">
                    Gestión de cuentas de usuario y sus roles dentro del sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Reportes */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body">
                  <i className="bi bi-bar-chart text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Reportes</h5>
                  <p className="card-text text-muted small">
                    Generación de informes detallados sobre las operaciones del sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Perfil */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('admin_dashboard')}
              >
                <div className="card-body">
                  <i className="bi bi-person text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Perfil</h5>
                  <p className="card-text text-muted small">
                    Administración de la información personal y configuraciones de cuenta.
                  </p>
                </div>
              </div>
            </div>

            {/* Módulo Tienda */}
            <div className="col-md-3">
              <div
                className="card shadow-sm border-0 text-center p-3 h-100 cursor-pointer hover-shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('home')}
              >
                <div className="card-body">
                  <i className="bi bi-shop text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="card-title fw-bold">Tienda</h5>
                  <p className="card-text text-muted small">
                    Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
