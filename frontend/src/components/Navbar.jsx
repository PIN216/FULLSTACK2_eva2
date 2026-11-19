import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

/**
 * Barra de navegación principal de la aplicación.
 * Permite cambiar de vista en el SPA, ver el estado del carrito,
 * acceder a los paneles restringidos por rol (Admin Panel para administradores
 * y Panel Vendedor para vendedores) y gestionar la sesión.
 */
export const Navbar = () => {
  const { currentView, setCurrentView, cart, cartTotal, currentUser, logout, isAdmin, isVendedor } = useContext(StoreContext);

  // Cantidad acumulada de artículos en el carrito
  const totalItems = cart.reduce((acc, i) => acc + i.cantidad, 0);

  // Rol legible para la etiqueta de usuario
  const rolEtiqueta = isAdmin ? 'Admin' : isVendedor ? 'Vendedor' : 'Cliente';
  const rolBadgeClass = isAdmin ? 'bg-danger' : isVendedor ? 'bg-warning text-dark' : 'bg-secondary';

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-warning">
        <div className="container">
          {/* Logo y título de la pastelería */}
          <button
            className="navbar-brand text-brown fw-bold btn btn-link text-decoration-none fs-4 brand-font"
            onClick={() => setCurrentView('home')}
          >
            🍰 Pastelería Mil Sabores
          </button>

          {/* Botón hamburguesa para dispositivos móviles */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Enlaces de navegación */}
          <div className="collapse navbar-collapse" id="navNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentView === 'home' ? 'active fw-bold' : ''}`} onClick={() => setCurrentView('home')}>
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentView === 'categorias' ? 'active fw-bold' : ''}`} onClick={() => setCurrentView('categorias')}>
                  Categorías
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentView === 'ofertas' ? 'active fw-bold' : ''}`} onClick={() => setCurrentView('ofertas')}>
                  Ofertas
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentView === 'nosotros' ? 'active fw-bold' : ''}`} onClick={() => setCurrentView('nosotros')}>
                  Nosotros
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentView === 'blogs' ? 'active fw-bold' : ''}`} onClick={() => setCurrentView('blogs')}>
                  Blog
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${currentView === 'contacto' ? 'active fw-bold' : ''}`} onClick={() => setCurrentView('contacto')}>
                  Contacto
                </button>
              </li>

              {/* Acceso exclusivo a panel de control para Administrador */}
              {isAdmin && (
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-danger fw-bold ${currentView.startsWith('admin') ? 'active' : ''}`}
                    onClick={() => setCurrentView('admin_dashboard')}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Admin Panel
                  </button>
                </li>
              )}

              {/* Acceso exclusivo a panel de control para Vendedor */}
              {isVendedor && (
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-primary fw-bold ${currentView === 'vendedor_panel' ? 'active' : ''}`}
                    onClick={() => setCurrentView('vendedor_panel')}
                  >
                    <i className="bi bi-person-badge me-1"></i> Panel Vendedor
                  </button>
                </li>
              )}
            </ul>

            {/* Accesos rápidos: Carrito y Autenticación */}
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => setCurrentView('carrito')}>
                <span>🛒 Carrito ({totalItems})</span>
                <span className="badge bg-light text-success">${cartTotal.toLocaleString('es-CL')}</span>
              </button>

              {currentUser ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex flex-column text-end">
                    <span className="fw-bold text-brown" style={{ fontSize: '0.9rem' }}>
                      👤 {currentUser.nombre}
                    </span>
                    <span className={`badge ${rolBadgeClass} align-self-end`} style={{ fontSize: '0.7rem' }}>
                      {rolEtiqueta}
                    </span>
                  </div>
                  <button className="btn btn-sm btn-outline-danger ms-1" onClick={logout}>Salir</button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary" onClick={() => setCurrentView('login')}>Ingresar</button>
                  <button className="btn btn-primary" onClick={() => setCurrentView('registro')}>Registrarse</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
