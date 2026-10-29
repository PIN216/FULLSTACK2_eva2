import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { UsuarioService } from '../services/usuarioService';
import { validarCorreo } from '../services/validacionService';

export const LoginView = () => {
  const { login, setCurrentView } = useContext(StoreContext);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errCorreo = validarCorreo(correo);
    if (errCorreo) { setError(errCorreo); return; }
    if (!password) { setError('La contraseña es obligatoria.'); return; }
    try {
      const u = await UsuarioService.login(correo.trim(), password);
      login(u);
      setCurrentView(u.rol === 'admin' ? 'admin_dashboard' : 'home');
    } catch (err) {
      setError(err.status === 401
        ? 'Credenciales incorrectas.'
        : 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '450px' }}>
      <div className="card shadow-sm p-4 border-0">
        <h3 className="fw-bold text-center text-brown mb-4 brand-font">Iniciar Sesión</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3"><label className="form-label">Correo</label><input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} required /></div>
          <div className="mb-3"><label className="form-label">Contraseña</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary-custom w-100 py-2">Ingresar</button>
        </form>
        <div className="mt-3 pt-3 border-top text-center">
          <small className="text-muted d-block mb-2">Credenciales demo: <code>admin@milsabores.cl</code> / <code>Admin1234</code></small>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary w-100"
            onClick={() => {
              login({ correo: 'admin@milsabores.cl', nombre: 'Administrador General', rol: 'admin', beneficios: [] });
              setCurrentView('admin_dashboard');
            }}
          >
            <i className="bi bi-shield-lock me-1"></i> Acceso Rápido Administrador (Demo / Sin Backend)
          </button>
        </div>
      </div>
    </div>
  );
};
