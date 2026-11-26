import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { UsuarioService } from '../services/usuarioService';
import { validarCorreo } from '../services/validacionService';

/**
 * Vista de Inicio de Sesión.
 * Autentica credenciales con el backend (emisión de tokens JWT)
 * y redirige automáticamente al usuario según su rol:
 * - Administrador -> Admin Panel / Dashboard
 * - Vendedor -> Panel de Vendedor
 * - Cliente -> Catálogo de la Tienda
 */
export const LoginView = () => {
  const { login, setCurrentView } = useContext(StoreContext);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errCorreo = validarCorreo(correo);
    if (errCorreo) { setError(errCorreo); return; }
    if (!password) { setError('La contraseña es obligatoria.'); return; }

    setCargando(true);
    try {
      const u = await UsuarioService.login(correo.trim(), password);
      login(u);

      const rol = (u.rol || '').toUpperCase().trim();
      if (rol === 'ADMIN' || rol === 'ADMINISTRADOR') {
        setCurrentView('admin_dashboard');
      } else if (rol === 'VENDEDOR') {
        setCurrentView('vendedor_panel');
      } else {
        setCurrentView('home');
      }
    } catch (err) {
      setError(err.status === 401
        ? 'Credenciales incorrectas. Verifica tu correo y contraseña.'
        : 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '480px' }}>
      <div className="card shadow-sm p-4 border-0">
        <h3 className="fw-bold text-center text-brown mb-4 brand-font">Iniciar Sesión</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@milsabores.cl"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 fw-semibold"
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center">
          <small className="text-muted d-block mb-3 fw-semibold">
            Accesos de Prueba Evaluativa (Roles según Requisitos ERS V3):
          </small>

          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger text-start"
              onClick={() => {
                login({ correo: 'admin@milsabores.cl', nombre: 'Administrador Mil Sabores', rol: 'ADMINISTRADOR', beneficios: ['ADMIN'] });
                setCurrentView('admin_dashboard');
              }}
            >
              <i className="bi bi-shield-lock me-1"></i> <strong>Admin:</strong> admin@milsabores.cl (Acceso total)
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-warning text-dark text-start"
              onClick={() => {
                login({ correo: 'vendedor@milsabores.cl', nombre: 'Vendedor Mil Sabores', rol: 'VENDEDOR', beneficios: ['VENTAS'] });
                setCurrentView('vendedor_panel');
              }}
            >
              <i className="bi bi-person-badge me-1"></i> <strong>Vendedor:</strong> vendedor@milsabores.cl (Solo catálogo y órdenes)
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary text-start"
              onClick={() => {
                login({ correo: 'cliente@milsabores.cl', nombre: 'Cliente Prueba', rol: 'CLIENTE', beneficios: ['MAYOR_50', 'FELICES50'] });
                setCurrentView('home');
              }}
            >
              <i className="bi bi-person me-1"></i> <strong>Cliente:</strong> cliente@milsabores.cl (Solo tienda)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
