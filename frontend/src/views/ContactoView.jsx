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
        <p className="text-muted text-center mb-4">¿Tienes dudas o pedidos especiales? Escríbenos y te responderemos a la brevedad.</p>
        {enviado ? (
          <div className="alert alert-success text-center">
            <h5>¡Mensaje enviado con éxito!</h5>
            <p className="mb-2">Gracias por contactarnos, {form.nombre}. Te responderemos pronto a {form.correo}.</p>
            <button className="btn btn-sm btn-outline-success mt-2" onClick={() => { setEnviado(false); setForm({ nombre: '', correo: '', mensaje: '' }); }}>Enviar otro mensaje</button>
          </div>
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

