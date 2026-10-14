import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { DataService } from '../data/dataService';

export const LoginView = () => {
  const { login, setCurrentView } = useContext(StoreContext);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    const usuario = DataService.buscarUsuario(correo);
    if (!usuario) {
      setError('El usuario no se encuentra registrado.');
      return;
    }

    if (usuario.password !== password) {
      setError('Contraseña incorrecta.');
      return;
    }

    login(usuario);
    alert(`¡Bienvenido/a de nuevo, ${usuario.nombre}!`);
    if (usuario.rol === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('home');
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto border-0" style={{ maxWidth: '450px' }}>
        <h3 className="fw-bold text-center text-brown mb-4 brand-font">Iniciar Sesión</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="admin@milsabores.cl"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary-custom w-100 py-2 mt-2">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};
