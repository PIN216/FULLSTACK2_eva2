import React, { useState } from 'react';

export const ContactoView = () => {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.mensaje) return;
    setEnviado(true);
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h3 className="fw-bold text-brown brand-font mb-3 text-center">Contáctanos</h3>
        {enviado ? (
          <div className="alert alert-success text-center">¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
            <div className="mb-3"><label className="form-label">Correo Electrónico</label><input type="email" className="form-control" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required /></div>
            <div className="mb-3"><label className="form-label">Mensaje</label><textarea className="form-control" rows="4" value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required></textarea></div>
            <button type="submit" className="btn btn-primary-custom w-100">Enviar Mensaje</button>
          </form>
        )}
      </div>
    </div>
  );
};
