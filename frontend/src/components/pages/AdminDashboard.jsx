import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* --- SIDEBAR / BARRA LATERAL (Figura 9 del documento) --- */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse p-3 border-end min-vh-100">
          <div className="position-sticky">
            <h5 className="sidebar-heading px-3 mt-2 mb-3 text-muted fw-bold">
              Company name
            </h5>
            <ul className="nav flex-column mb-4">
              <li className="nav-item mb-1">
                <Link className="nav-link active bg-primary text-white rounded fw-semibold" to="/admin/dashboard">
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link text-dark" to="/admin/ordenes">
                  <i className="bi bi-cart me-2"></i> Órdenes
                </Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link text-dark" to="/admin/productos">
                  <i className="bi bi-box-seam me-2"></i> Productos
                </Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link text-dark" to="/admin/categorias">
                  <i className="bi bi-tags me-2"></i> Categorías
                </Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link text-dark" to="/admin/usuarios">
                  <i className="bi bi-people me-2"></i> Usuarios
                </Link>
              </li>
              <li className="nav-item mb-1">
                <Link className="nav-link text-dark" to="/admin/reportes">
                  <i className="bi bi-bar-chart me-2"></i> Reportes
                </Link>
              </li>
            </ul>

            <hr />

            <ul className="nav flex-column mb-3">
              <li className="nav-item mb-1">
                <Link className="nav-link text-dark" to="/admin/perfil">
                  <i className="bi bi-person me-2"></i> Perfil
                </Link>
              </li>
            </ul>

            <div className="d-grid gap-2 mt-4">
              <Link to="/" className="btn btn-dark text-white fw-bold py-2">
                <i className="bi bi-shop me-2"></i> Tienda
              </Link>
              <button className="btn btn-danger text-white fw-bold py-2">
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>

        {/* --- CONTENIDO PRINCIPAL / MAIN DASHBOARD --- */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 bg-light">
          <div className="mb-4">
            <h1 className="h2 fw-bold">Dashboard</h1>
            <p className="text-muted">Resumen de las actividades diarias</p>
          </div>

          {/* TARJETAS SUPERIORES DE MÉTRICAS / METRIC CARDS */}
          <div className="row g-3 mb-4">
            {/* Tarjeta Compras */}
            <div className="col-md-4">
              <div className="card bg-primary text-white shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Compras</h6>
                    <h2 className="display-6 fw-bold mb-0">1,234</h2>
                    <small className="opacity-75">Probabilidad de aumento: 20%</small>
                  </div>
                  <i className="bi bi-cart-check fs-1"></i>
                </div>
              </div>
            </div>

            {/* Tarjeta Productos */}
            <div className="col-md-4">
              <div className="card bg-success text-white shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Productos</h6>
                    <h2 className="display-6 fw-bold mb-0">400</h2>
                    <small className="opacity-75">Inventario actual: 500</small>
                  </div>
                  <i className="bi bi-box-seam fs-1"></i>
                </div>
              </div>
            </div>

            {/* Tarjeta Usuarios */}
            <div className="col-md-4">
              <div className="card bg-warning text-dark shadow-sm border-0 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Usuarios</h6>
                    <h2 className="display-6 fw-bold mb-0">890</h2>
                    <small className="opacity-75">Nuevos este mes: 120</small>
                  </div>
                  <i className="bi bi-people fs-1"></i>
                </div>
              </div>
            </div>
          </div>

          {/* GRILLA DE ACCESOS RÁPIDOS / GRID DE MÓDULOS*/}
          <div className="row g-3">
            {/* Módulo Dashboard */}
            <div className="col-md-3">
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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
              <div className="card shadow-sm border-0 text-center p-3 h-100">
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