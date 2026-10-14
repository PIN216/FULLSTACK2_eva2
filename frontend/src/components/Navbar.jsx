import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export const Navbar = () => {
  const { currentView, setCurrentView, cart, cartTotal, currentUser, logout } = useContext(StoreContext);
  const totalItems = cart.reduce((acc, it) => acc + it.cantidad, 0);

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-warning">
        <div className="container">
          <button
            className="navbar-brand text-brown fw-bold btn btn-link text-decoration-none fs-4 brand-font"
            onClick={() => setCurrentView('home')}
          >
            🍰 Pastelería Mil Sabores
          </button>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${currentView === 'home' ? 'active fw-bold' : ''}`}
                  onClick={() => setCurrentView('home')}
                >
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${currentView === 'categorias' ? 'active fw-bold' : ''}`}
                  onClick={() => setCurrentView('categorias')}
                >
                  Categorías
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${currentView === 'ofertas' ? 'active fw-bold' : ''}`}
                  onClick={() => setCurrentView('ofertas')}
                >
                  Ofertas
                </button>
              </li>
              {currentUser?.rol === 'admin' && (
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-danger fw-bold ${currentView.startsWith('admin') ? 'active' : ''}`}
                    onClick={() => setCurrentView('admin_dashboard')}
                  >
                    Panel Admin
                  </button>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={() => setCurrentView('carrito')}
              >
                <span>🛒 Carrito ({totalItems})</span>
                <span className="badge bg-light text-success">${cartTotal.toLocaleString('es-CL')}</span>
              </button>

              {currentUser ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-brown">👤 {currentUser.nombre}</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={logout}>Salir</button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary" onClick={() => setCurrentView('login')}>
                    Ingresar
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentView('registro')}>
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
