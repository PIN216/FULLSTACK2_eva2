/**
 * Servicios de Validación Compartida para Formularios.
 * Provee funciones puras utilizadas en Login, Registro y Checkout.
 * Cada función retorna una cadena vacía ('') si el dato es válido, o un mensaje de error si no lo es.
 */

// Expresión regular para correo electrónico según estándares RFC:
// TLD de 2 a 24 letras (.com, .cl, .org, etc.), sin puntos consecutivos ni al inicio/final.
const REGEX_CORREO = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

/**
 * Evalúa si una dirección de correo cumple con el formato estándar requerido.
 * @param {string} correo - Correo a validar.
 * @returns {boolean} True si es válido y no excede los 254 caracteres.
 */
export const esCorreoValido = (correo) => {
  const c = String(correo || '').trim();
  return c.length <= 254 && REGEX_CORREO.test(c);
};

/**
 * Valida un campo de correo electrónico y devuelve mensaje de error amigable.
 * @param {string} correo - Dirección ingresada.
 * @returns {string} Mensaje de error o cadena vacía si es válido.
 */
export const validarCorreo = (correo) => {
  const c = String(correo || '').trim();
  if (!c) return 'El correo es obligatorio.';
  if (!esCorreoValido(c)) return 'Ingresa un correo válido (ejemplo: nombre@dominio.com).';
  return '';
};

/**
 * Valida los requisitos de seguridad de la contraseña (mínimo 6 caracteres).
 * @param {string} password - Contraseña ingresada.
 * @returns {string} Mensaje de error o cadena vacía.
 */
export const validarPassword = (password) => {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return '';
};

// Expresión regular para nombres: solo letras (incluye tildes/ñ), espacios, apóstrofes y guiones.
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

/**
 * Valida un campo de texto para nombre o apellido.
 * @param {string} valor - Nombre o etiqueta a evaluar.
 * @param {string} [etiqueta='El nombre'] - Nombre del campo para el mensaje.
 * @returns {string} Mensaje de error o cadena vacía.
 */
export const validarNombre = (valor, etiqueta = 'El nombre') => {
  const v = String(valor || '').trim();
  if (!v) return `${etiqueta} es obligatorio.`;
  if (v.length < 2) return `${etiqueta} debe tener al menos 2 caracteres.`;
  if (v.length > 60) return `${etiqueta} es demasiado largo.`;
  if (!REGEX_NOMBRE.test(v)) return `${etiqueta} solo puede contener letras.`;
  return '';
};

/**
 * Valida el campo de dirección de despacho (mínimo 5 caracteres para calle y número).
 * @param {string} calle - Dirección especificada.
 * @returns {string} Mensaje de error o cadena vacía.
 */
export const validarDireccion = (calle) => {
  const v = String(calle || '').trim();
  if (!v) return 'La dirección es obligatoria.';
  if (v.length < 5) return 'La dirección es demasiado corta (incluye calle y número).';
  if (v.length > 120) return 'La dirección es demasiado larga.';
  return '';
};

/**
 * Valida el campo de comuna de despacho.
 * @param {string} comuna - Nombre de la comuna.
 * @returns {string} Mensaje de error o cadena vacía.
 */
export const validarComuna = (comuna) => {
  const v = String(comuna || '').trim();
  if (!v) return 'La comuna es obligatoria.';
  if (v.length < 3) return 'La comuna es demasiado corta.';
  if (!REGEX_NOMBRE.test(v)) return 'La comuna solo puede contener letras.';
  return '';
};

/**
 * Retorna el primer mensaje de error encontrado de una lista, o cadena vacía si no hay errores.
 * @param {...string} errores - Lista de errores a evaluar.
 * @returns {string} Primer error no vacío.
 */
export const primerError = (...errores) => errores.find(Boolean) || '';
