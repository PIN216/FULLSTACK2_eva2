import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { OrdenService } from '../services/ordenService';

export const CheckoutView = () => {
  const { cart, cartTotal, currentUser, clearCart, setLastOrder, setCurrentView } = useContext(StoreContext);
  const [form, setForm] = useState({ nombre: '', apellidos: '', correo: '', calle: '', comuna: 'Cerrillos', simularError: false });

  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.nombre || '').split(' ');
      setForm(prev => ({ ...prev, nombre: parts[0] || '', apellidos: parts.slice(1).join(' ') || '', correo: currentUser.correo || '' }));
    }
  }, [currentUser]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (form.simularError) {
      setLastOrder({ ...form, items: cart, total: cartTotal });
      setCurrentView('pago_error');
      return;
    }

    const nuevaOrden = await OrdenService.crearOrden({
      cliente: { nombre: `${form.nombre} ${form.apellidos}`, correo: form.correo },
      direccion: { calle: form.calle, comuna: form.comuna },
      items: cart, total: cartTotal
    });

    setLastOrder(nuevaOrden);
    clearCart();
    setCurrentView('pago_exito');
  };

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      <div className="card shadow-sm border-0 p-4">
        <h3 className="fw-bold text-brown mb-4">Checkout - Finalizar Compra</h3>
        <form onSubmit={handlePay}>
          <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Apellidos</label><input type="text" className="form-control" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Correo Electrónico</label><input type="email" className="form-control" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Dirección / Calle</label><input type="text" className="form-control" value={form.calle} onChange={e => setForm({...form, calle: e.target.value})} required /></div>
          <div className="form-check form-switch mb-4 p-3 bg-light rounded">
            <input className="form-check-input ms-0 me-2" type="checkbox" checked={form.simularError} onChange={e => setForm({...form, simularError: e.target.checked})} />
            <label className="form-check-label fw-bold">Simular Error en Pasarela de Pago</label>
          </div>
          <button type="submit" className="btn btn-success btn-lg w-100 fw-bold">Pagar ${cartTotal.toLocaleString('es-CL')}</button>
        </form>
      </div>
    </div>
  );
};
