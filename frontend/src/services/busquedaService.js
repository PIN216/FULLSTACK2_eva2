// Búsqueda de productos por texto.
//  - No distingue mayúsculas de minúsculas ni tildes ("MANJAR" = "manjar", "azucar" = "Azúcar").
//  - Busca en el nombre y en la categoría del producto.
//  - Un término vacío devuelve todos los productos.

const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

export const buscarProductos = (productos = [], termino = '') => {
  const t = normalizar(termino);
  if (!t) return productos;
  return productos.filter(
    (p) => normalizar(p.nombre).includes(t) || normalizar(p.categoria).includes(t)
  );
};
