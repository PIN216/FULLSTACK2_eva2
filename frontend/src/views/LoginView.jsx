import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { UsuarioService } from '../services/usuarioService';

export const LoginView = () => {
  const { login, setCurrentView } = useContext(StoreContext);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
        <form onSubmit={handleSubmit}>
          <div className="mb-3"><label className="form-label">Correo</label><input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} required /></div>
          <div className="mb-3"><label className="form-label">Contraseña</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary-custom w-100 py-2">Ingresar</button>
        </form>
      </div>
    </div>
  );
};
