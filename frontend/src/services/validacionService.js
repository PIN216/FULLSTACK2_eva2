// Validaciones compartidas por Login, Registro y Checkout.
// Cada función devuelve '' si el dato es válido, o el mensaje de error si no lo es.

// usuario@dominio.tld  → TLD de 2 a 24 letras (.com, .cl, .org, .edu, .co.uk, etc.)
// Sin espacios, sin puntos al inicio/final ni consecutivos, sin guiones al borde del dominio.
const REGEX_CORREO = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]{1,64}(?<!\.)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export const esCorreoValido = (correo) => {
  const c = String(correo || '').trim();
  return c.length <= 254 && REGEX_CORREO.test(c);
};

export const validarCorreo = (correo) => {
  const c = String(correo || '').trim();
  if (!c) return 'El correo es obligatorio.';
  if (!esCorreoValido(c)) return 'Ingresa un correo válido (ejemplo: nombre@dominio.com).';
  return '';
};

export const validarPassword = (password) => {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return '';
};

// Solo letras (con tildes/ñ), espacios, apóstrofes y guiones.
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

export const validarNombre = (valor, etiqueta = 'El nombre') => {
  const v = String(valor || '').trim();
  if (!v) return `${etiqueta} es obligatorio.`;
  if (v.length < 2) return `${etiqueta} debe tener al menos 2 caracteres.`;
  if (v.length > 60) return `${etiqueta} es demasiado largo.`;
  if (!REGEX_NOMBRE.test(v)) return `${etiqueta} solo puede contener letras.`;
  return '';
};

export const validarDireccion = (calle) => {
  const v = String(calle || '').trim();
  if (!v) return 'La dirección es obligatoria.';
  if (v.length < 5) return 'La dirección es demasiado corta (incluye calle y número).';
  if (v.length > 120) return 'La dirección es demasiado larga.';
  return '';
};

export const validarComuna = (comuna) => {
  const v = String(comuna || '').trim();
  if (!v) return 'La comuna es obligatoria.';
  if (v.length < 3) return 'La comuna es demasiado corta.';
  if (!REGEX_NOMBRE.test(v)) return 'La comuna solo puede contener letras.';
  return '';
};

/** Devuelve el primer error de una lista de resultados, o '' si todo está bien. */
export const primerError = (...errores) => errores.find(Boolean) || '';
