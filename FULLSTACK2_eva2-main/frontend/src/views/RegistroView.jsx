import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { UsuarioService } from '../services/usuarioService';
import { calcularBeneficios, calcularEdad } from '../services/descuentoService';

export const RegistroView = () => {
  const { setCurrentView } = useContext(StoreContext);
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', fechaNacimiento: '', codigoPromo: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const correo = form.correo.trim().toLowerCase();

    const edad = calcularEdad(form.fechaNacimiento);
    if (edad === null || edad < 0 || edad > 120) {
      setError('Ingresa una fecha de nacimiento válida.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (UsuarioService.buscarUsuario(correo)) {
      setError('Ya existe una cuenta con ese correo.');
      return;
    }

    // Beneficios calculados una sola vez al registrarse (mayor de 50 años, cupón FELICES50)
    const beneficios = calcularBeneficios(form);
    UsuarioService.createUsuario({
      nombre: form.nombre.trim(),
      correo,
      password: form.password,
      fechaNacimiento: form.fechaNacimiento,
      rol: 'cliente',
      beneficios
    });
    setCurrentView('login');
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm p-4 border-0">
        <h3 className="fw-bold text-center text-brown mb-3 brand-font">Crear Cuenta</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
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
