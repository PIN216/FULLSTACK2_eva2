import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { OrdenService } from '../services/ordenService';
import { precioFinal } from '../services/descuentoService';

export const CheckoutView = () => {
  const { cart, cartResumen, cartTotal, currentUser, clearCart, setLastOrder, setCurrentView } = useContext(StoreContext);
  const [form, setForm] = useState({ nombre: '', apellidos: '', correo: '', calle: '', comuna: '', simularError: false });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.nombre || '').split(' ');
      setForm(prev => ({ ...prev, nombre: parts[0] || '', apellidos: parts.slice(1).join(' ') || '', correo: currentUser.correo || '' }));
    }
  }, [currentUser]);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0">
          <h3>No hay productos para pagar 🛒</h3>
          <button className="btn btn-primary mt-3" onClick={() => setCurrentView('home')}>Ir al Catálogo</button>
        </div>
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    if (enviando) return;

    const items = cart.map(i => ({ id: i.id, nombre: i.nombre, precio: precioFinal(i), cantidad: i.cantidad }));

    if (form.simularError) {
      setLastOrder({ ...form, items, total: cartTotal });
      setCurrentView('pago_error');
      return;
    }

    setEnviando(true);
    const nuevaOrden = await OrdenService.crearOrden({
      cliente: { nombre: `${form.nombre} ${form.apellidos}`.trim(), correo: form.correo },
      direccion: { calle: form.calle, comuna: form.comuna },
      items,
      subtotal: cartResumen.subtotal,
      descuento: cartResumen.descuento,
      total: cartTotal
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
          <div className="mb-3"><label className="form-label">Comuna</label><input type="text" className="form-control" placeholder="Ej: Cerrillos" value={form.comuna} onChange={e => setForm({...form, comuna: e.target.value})} required /></div>
          <div className="form-check form-switch mb-4 p-3 bg-light rounded">
            <input className="form-check-input ms-0 me-2" type="checkbox" checked={form.simularError} onChange={e => setForm({...form, simularError: e.target.checked})} />
            <label className="form-check-label fw-bold">Simular Error en Pasarela de Pago</label>
          </div>
          <button type="submit" disabled={enviando} className="btn btn-success btn-lg w-100 fw-bold">
            {enviando ? 'Procesando...' : `Pagar $${cartTotal.toLocaleString('es-CL')}`}
          </button>
        </form>
      </div>
    </div>
  );
};
