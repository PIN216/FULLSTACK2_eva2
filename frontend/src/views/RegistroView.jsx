import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { DataService } from '../data/dataService';

export const RegistroView = () => {
  const { setCurrentView } = useContext(StoreContext);
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    fechaNacimiento: '',
    password: '',
    confirmPassword: '',
    codigoPromo: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.nombre.trim()) {
      err.nombre = 'El nombre es obligatorio.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre)) {
      err.nombre = 'Solo letras y espacios.';
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.correo.trim()) {
      err.correo = 'El correo es obligatorio.';
    } else if (!regexEmail.test(form.correo)) {
      err.correo = 'Formato de correo inválido.';
    } else if (DataService.buscarUsuario(form.correo)) {
      err.correo = 'Este correo ya se encuentra registrado.';
    }

    if (!form.fechaNacimiento) {
      err.fechaNacimiento = 'Indique su fecha de nacimiento.';
    } else {
      const hoy = new Date();
      const fn = new Date(form.fechaNacimiento);
      let edad = hoy.getFullYear() - fn.getFullYear();
      if (hoy.getMonth() < fn.getMonth() || (hoy.getMonth() === fn.getMonth() && hoy.getDate() < fn.getDate())) {
        edad--;
      }
      if (edad < 14 || edad > 110) {
        err.fechaNacimiento = 'Fecha fuera de rango válido (14 a 110 años).';
      }
    }

    if (!form.password) {
      err.password = 'Contraseña obligatoria.';
    } else if (form.password.length < 8) {
      err.password = 'Mínimo 8 caracteres.';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(form.password)) {
      err.password = 'Debe incluir al menos 1 letra y 1 número.';
    }

    if (form.confirmPassword !== form.password) {
      err.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fn = new Date(form.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fn.getFullYear();

    const beneficios = [];
    if (edad > 50) beneficios.push('Descuento 50% por Aniversario (>50 años)');
    if (form.codigoPromo.toUpperCase() === 'FELICES50') beneficios.push('Descuento 10% Vitalicio (FELICES50)');
    if (form.correo.endsWith('@duoc.cl') || form.correo.endsWith('@duocuc.cl')) {
      beneficios.push('Torta Gratis en tu Cumpleaños (Convenio Duoc UC)');
    }

    DataService.createUsuario({
      nombre: form.nombre,
      correo: form.correo.toLowerCase(),
      password: form.password,
      fechaNacimiento: form.fechaNacimiento,
      edad,
      beneficios,
      rol: 'cliente'
    });

    alert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
    setCurrentView('login');
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 mx-auto border-0" style={{ maxWidth: '550px' }}>
        <h3 className="fw-bold text-center text-brown mb-3 brand-font">Crear Cuenta</h3>

        <div className="alert alert-info py-2 small mb-4">
          <strong>Beneficios de aniversario:</strong><br />
          • Mayores de 50 años obtienen 50% de descuento.<br />
          • Código <code>FELICES50</code> otorga 10% de descuento vitalicio.<br />
          • Alumnos Duoc (@duoc.cl / @duocuc.cl) obtienen torta de cumpleaños gratis.
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
            <label className="form-label">Nombre Completo *</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
            />
            {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Fecha de Nacimiento *</label>
            <input
              type="date"
              className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
              value={form.fechaNacimiento}
              onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            />
            {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Confirmar Contraseña *</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Código Promocional (Opcional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: FELICES50"
              value={form.codigoPromo}
              onChange={(e) => setForm({ ...form, codigoPromo: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary-custom w-100 py-2">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};
