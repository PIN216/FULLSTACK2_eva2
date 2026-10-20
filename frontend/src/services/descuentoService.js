// Reglas de negocio de precios y descuentos (ERS V2):
//  - Producto en oferta: se aplica su % de descuento.
//  - Cliente mayor de 50 años: 50% de descuento sobre el total.
//  - Código FELICES50: 10% de descuento vitalicio.
//  Los descuentos de cliente NO se acumulan: se aplica el más alto.

export const CODIGO_FELICES50 = 'FELICES50';
export const BENEFICIO_MAYOR_50 = 'MAYOR_50';
export const BENEFICIO_FELICES50 = 'FELICES50';
const PORCENTAJES = { [BENEFICIO_MAYOR_50]: 50, [BENEFICIO_FELICES50]: 10 };

/** Precio unitario que realmente se paga (aplica oferta del producto). */
export const precioFinal = (p) => {
  const precio = Number(p?.precio) || 0;
  const desc = Number(p?.descuento) || 0;
  return p?.enOferta && desc > 0 ? Math.round(precio * (1 - desc / 100)) : precio;
};

/** Edad en años cumplidos a la fecha `hoy`. Recibe 'YYYY-MM-DD'. Devuelve null si la fecha no es válida. */
export const calcularEdad = (fechaNacimiento, hoy = new Date()) => {
  if (!fechaNacimiento) return null;
  const [y, m, d] = String(fechaNacimiento).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  let edad = hoy.getFullYear() - y;
  const aunNoCumple = hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d);
  if (aunNoCumple) edad -= 1;
  return edad;
};

/** Lista de beneficios que corresponden a un usuario al registrarse. */
export const calcularBeneficios = ({ fechaNacimiento, codigoPromo } = {}, hoy = new Date()) => {
  const beneficios = [];
  const edad = calcularEdad(fechaNacimiento, hoy);
  if (edad !== null && edad > 50) beneficios.push(BENEFICIO_MAYOR_50);
  if (String(codigoPromo || '').trim().toUpperCase() === CODIGO_FELICES50) beneficios.push(BENEFICIO_FELICES50);
  return beneficios;
};

/** Porcentaje de descuento de cliente (el mayor de sus beneficios). */
export const porcentajeDescuentoUsuario = (beneficios = []) =>
  Math.max(0, ...beneficios.map((b) => PORCENTAJES[b] || 0));

/** Totales del carrito: ahorro por ofertas, descuento de cliente y total a pagar. */
export const calcularTotales = (items = [], usuario = null) => {
  const bruto = items.reduce((a, i) => a + (Number(i.precio) || 0) * i.cantidad, 0);
  const subtotal = items.reduce((a, i) => a + precioFinal(i) * i.cantidad, 0);
  const porcentaje = porcentajeDescuentoUsuario(usuario?.beneficios);
  const descuento = Math.round((subtotal * porcentaje) / 100);
  return {
    bruto,
    ahorroOfertas: bruto - subtotal,
    subtotal,
    porcentaje,
    descuento,
    total: subtotal - descuento
  };
};
