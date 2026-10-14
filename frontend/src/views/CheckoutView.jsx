import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { DataService } from '../data/dataService';

export const CheckoutView = () => {
  const { cart, cartTotal, currentUser, clearCart, setLastOrder, setCurrentView } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    depto: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: '',
    simularError: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      const parts = (currentUser.nombre || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        nombre: parts[0] || '',
        apellidos: parts.slice(1).join(' ') || '',
        correo: currentUser.correo || ''
      }));
    }
  }, [currentUser]);

  const validate = () => {
    const err = {};
    if (!formData.nombre.trim()) err.nombre = 'El nombre es obligatorio.';
    if (!formData.apellidos.trim()) err.apellidos = 'Los apellidos son obligatorios.';
    if (!formData.correo.trim()) err.correo = 'El correo es obligatorio.';
    if (!formData.calle.trim()) err.calle = 'La calle y número son obligatorios.';
    if (!formData.comuna.trim()) err.comuna = 'La comuna es obligatoria.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (formData.simularError) {
      setLastOrder({ ...formData, items: cart, total: cartTotal });
      setCurrentView('pago_error');
      return;
    }

    const nuevaOrden = DataService.createOrden({
      cliente: {
        nombre: `${formData.nombre} ${formData.apellidos}`,
        correo: formData.correo
      },
      direccion: {
        calle: formData.calle,
        depto: formData.depto,
        region: formData.region,
        comuna: formData.comuna,
        indicaciones: formData.indicaciones
      },
      items: cart,
      total: cartTotal
    });

    setLastOrder(nuevaOrden);
    clearCart();
    setCurrentView('pago_exito');
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0 text-brown">Finalizar Compra</h3>
              <span className="badge bg-primary fs-6">Total: ${cartTotal.toLocaleString('es-CL')}</span>
            </div>

            <form onSubmit={handlePay} noValidate>
              <h5 className="border-bottom pb-2 mb-3">Información del Cliente</h5>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellidos *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  />
                  {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Correo Electrónico *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  />
                  {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                </div>
              </div>

              <h5 className="border-bottom pb-2 mb-3">Dirección de Despacho</h5>
              <div className="row g-3 mb-3">
                <div className="col-md-8">
                  <label className="form-label">Calle y Número *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.calle ? 'is-invalid' : ''}`}
                    value={formData.calle}
                    onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                  />
                  {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Depto / Casa (Opcional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.depto}
                    onChange={(e) => setFormData({ ...formData, depto: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Región</label>
                  <select
                    className="form-select"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                    <option value="Región de Valparaíso">Región de Valparaíso</option>
                    <option value="Región del Biobío">Región del Biobío</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Comuna *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.comuna ? 'is-invalid' : ''}`}
                    value={formData.comuna}
                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  />
                  {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Indicaciones para el repartidor (Opcional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.indicaciones}
                    placeholder="Ej: Dejar con conserjería o portón negro..."
                    onChange={(e) => setFormData({ ...formData, indicaciones: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="form-check form-switch mb-4 p-3 bg-light rounded">
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  id="simularErrorSwitch"
                  checked={formData.simularError}
                  onChange={(e) => setFormData({ ...formData, simularError: e.target.checked })}
                />
                <label className="form-check-label fw-bold" htmlFor="simularErrorSwitch">
                  Simular Fallo en Pasarela de Pago (Prueba de Flujo Alternativo)
                </label>
              </div>

              <button type="submit" className="btn btn-success btn-lg w-100 fw-bold">
                Pagar ahora ${cartTotal.toLocaleString('es-CL')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
