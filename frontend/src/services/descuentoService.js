/**
 * Módulo de Reglas de Negocio de Precios y Descuentos (ERS V2):
 * - Producto en oferta: se aplica el porcentaje de descuento del producto.
 * - Cliente mayor de 50 años: 50% de descuento sobre el subtotal del pedido.
 * - Código FELICES50: 10% de descuento vitalicio por registro con cupón.
 * - Restricción: Los descuentos de cliente NO se acumulan entre sí (se aplica el mayor beneficio).
 */

export const CODIGO_FELICES50 = 'FELICES50';
export const BENEFICIO_MAYOR_50 = 'MAYOR_50';
export const BENEFICIO_FELICES50 = 'FELICES50';

/** Tabla de porcentajes asociados a cada código de beneficio */
const PORCENTAJES = {
  [BENEFICIO_MAYOR_50]: 50,
  [BENEFICIO_FELICES50]: 10
};

/**
 * Calcula el precio unitario final a pagar considerando si el producto está en oferta.
 * @param {Object} p - Producto con propiedades precio, enOferta y descuento.
 * @returns {number} Precio unitario final redondeado al entero más cercano.
 */
export const precioFinal = (p) => {
  const precio = Number(p?.precio) || 0;
  const desc = Number(p?.descuento) || 0;
  return p?.enOferta && desc > 0 ? Math.round(precio * (1 - desc / 100)) : precio;
};

/**
 * Calcula la edad en años cumplidos a la fecha de referencia `hoy`.
 * @param {string} fechaNacimiento - Fecha en formato 'YYYY-MM-DD'.
 * @param {Date} [hoy=new Date()] - Fecha de referencia para el cálculo.
 * @returns {number|null} Edad en años o null si la fecha proporcionada es inválida.
 */
export const calcularEdad = (fechaNacimiento, hoy = new Date()) => {
  if (!fechaNacimiento) return null;
  const [y, m, d] = String(fechaNacimiento).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  let edad = hoy.getFullYear() - y;
  const aunNoCumple = hoy.getMonth() + 1 < m || (hoy.getMonth() + 1 === m && hoy.getDate() < d);
  if (aunNoCumple) edad -= 1;
  return edad;
};

/**
 * Determina la lista de beneficios que le corresponden a un usuario en su registro.
 * @param {Object} [datos] - Datos del formulario ({ fechaNacimiento, codigoPromo }).
 * @param {Date} [hoy=new Date()] - Fecha actual de validación.
 * @returns {string[]} Lista de códigos de beneficios aplicables (ej: ['MAYOR_50', 'FELICES50']).
 */
export const calcularBeneficios = ({ fechaNacimiento, codigoPromo } = {}, hoy = new Date()) => {
  const beneficios = [];
  const edad = calcularEdad(fechaNacimiento, hoy);
  if (edad !== null && edad > 50) beneficios.push(BENEFICIO_MAYOR_50);
  if (String(codigoPromo || '').trim().toUpperCase() === CODIGO_FELICES50) beneficios.push(BENEFICIO_FELICES50);
  return beneficios;
};

/**
 * Obtiene el porcentaje de descuento aplicable al usuario según su mayor beneficio registrado.
 * @param {string[]} [beneficios=[]] - Colección de beneficios del cliente.
 * @returns {number} Porcentaje de descuento (0, 10 o 50).
 */
export const porcentajeDescuentoUsuario = (beneficios = []) =>
  Math.max(0, ...beneficios.map((b) => PORCENTAJES[b] || 0));

/**
 * Calcula los totales consolidados del carrito de compras:
 * monto bruto, ahorro por ofertas individuales, subtotal, descuento por cliente y total neto.
 * @param {Array<Object>} [items=[]] - Productos en el carrito con cantidad y precio.
 * @param {Object|null} [usuario=null] - Usuario autenticado con sus beneficios.
 * @returns {{bruto: number, ahorroOfertas: number, subtotal: number, porcentaje: number, descuento: number, total: number}}
 */
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
