import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { UsuarioService } from '../services/usuarioService';

export const RegistroView = () => {
  const { setCurrentView } = useContext(StoreContext);
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', fechaNacimiento: '', codigoPromo: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    UsuarioService.createUsuario({ ...form, rol: 'cliente' });
    alert('¡Registro exitoso!');
    setCurrentView('login');
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm p-4 border-0">
        <h3 className="fw-bold text-center text-brown mb-3 brand-font">Crear Cuenta</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2"><label className="form-label">Nombre Completo</label><input type="text" className="form-control" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
          <div className="mb-2"><label className="form-label">Correo Electrónico</label><input type="email" className="form-control" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required /></div>
          <div className="mb-2"><label className="form-label">Fecha de Nacimiento</label><input type="date" className="form-control" value={form.fechaNacimiento} onChange={e => setForm({...form, fechaNacimiento: e.target.value})} required /></div>
          <div className="mb-2"><label className="form-label">Contraseña</label><input type="password" className="form-control" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Código Promocional</label><input type="text" className="form-control" placeholder="FELICES50" value={form.codigoPromo} onChange={e => setForm({...form, codigoPromo: e.target.value})} /></div>
          <button type="submit" className="btn btn-primary-custom w-100 py-2">Registrarse</button>
        </form>
      </div>
    </div>
  );
};
