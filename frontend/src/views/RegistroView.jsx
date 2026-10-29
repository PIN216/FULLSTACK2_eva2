import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { UsuarioService } from '../services/usuarioService';
import { calcularEdad } from '../services/descuentoService';
import { validarNombre, validarCorreo, validarPassword } from '../services/validacionService';

export const RegistroView = () => {
  const { setCurrentView } = useContext(StoreContext);
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', fechaNacimiento: '', codigoPromo: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errNombre = validarNombre(form.nombre, 'El nombre');
    if (errNombre) { setError(errNombre); return; }
    const errCorreo = validarCorreo(form.correo);
    if (errCorreo) { setError(errCorreo); return; }

    const edad = calcularEdad(form.fechaNacimiento);
    if (edad === null || edad < 0 || edad > 120) {
      setError('Ingresa una fecha de nacimiento válida.');
      return;
    }
    const errPass = validarPassword(form.password);
    if (errPass) { setError(errPass); return; }

    try {
      // El servidor cifra la contraseña y calcula los beneficios (mayor de 50 años, cupón FELICES50).
      await UsuarioService.registrar({
        nombre: form.nombre.trim(),
        correo: form.correo.trim().toLowerCase(),
        password: form.password,
        fechaNacimiento: form.fechaNacimiento,
        codigoPromo: form.codigoPromo.trim()
      });
      setCurrentView('login');
    } catch (err) {
      if (err.status === 409) setError('Ya existe una cuenta con ese correo.');
      else if (err.status === 400) setError('Revisa los datos ingresados.');
      else setError('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm p-4 border-0">
        <h3 className="fw-bold text-center text-brown mb-3 brand-font">Crear Cuenta</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
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
