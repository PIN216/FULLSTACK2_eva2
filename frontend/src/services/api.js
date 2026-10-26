// URL del backend. En react-scripts se puede cambiar con REACT_APP_API_URL (archivo .env).
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9091/api';

const LS_PRODUCTOS = 'pms_productos';
const LS_ORDENES = 'pms_ordenes';
const IMAGEN_TORTA_MANJAR = 'https://www.elingenio.cl/productos/bizcocho-manjar-lucuma.jpg';
const IMAGEN_TORTA_MANJAR_ANTERIOR = 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600';

const PRODUCTOS_POR_DEFECTO = [
  { id: 1, nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", precio: 45000, stock: 12, enOferta: false, descuento: 0, descripcion: "Capas de ganache con avellanas.", imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600" },
  { id: 2, nombre: "Torta Circular de Manjar", categoria: "Tortas Circulares", precio: 42000, stock: 4, enOferta: true, descuento: 15, descripcion: "Receta tradicional chilena con manjar casero.", imagen: IMAGEN_TORTA_MANJAR },
  { id: 3, nombre: "Cheesecake Sin Azúcar", categoria: "Sin Azúcar", precio: 47000, stock: 5, enOferta: false, descuento: 0, descripcion: "Suave y cremoso postre saludable.", imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600" },
  { id: 4, nombre: "Brownie Sin Gluten", categoria: "Sin Gluten", precio: 4000, stock: 25, enOferta: true, descuento: 10, descripcion: "Rico chocolate amargo apto para celíacos.", imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600" }
];

// ---------- Respaldo local (cuando el backend no responde) ----------
const leer = (clave) => {
  try {
    const v = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
};
const guardar = (clave, lista) => localStorage.setItem(clave, JSON.stringify(lista));
const actualizarImagenTortaManjar = (productos) => {
  let actualizado = false;
  const lista = productos.map((producto) => {
    if (producto.id === 2 && producto.imagen === IMAGEN_TORTA_MANJAR_ANTERIOR) {
      actualizado = true;
      return { ...producto, imagen: IMAGEN_TORTA_MANJAR };
    }
    return producto;
  });
  if (actualizado) guardar(LS_PRODUCTOS, lista);
  return lista;
};

// La primera vez se siembra el catálogo por defecto, así crear/eliminar no deja la lista vacía.
const productosLocales = () => {
  const lista = leer(LS_PRODUCTOS);
  if (lista) return actualizarImagenTortaManjar(lista);
  const inicial = PRODUCTOS_POR_DEFECTO.map((p) => ({ ...p }));
  guardar(LS_PRODUCTOS, inicial);
  return inicial;
};

const guardarOrdenLocal = (orden) => {
  const lista = leer(LS_ORDENES) || [];
  guardar(LS_ORDENES, [...lista, orden]);
  return orden;
};

// ---------- Cliente HTTP ----------
const request = async (ruta, opciones = {}) => {
  const res = await fetch(`${API_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.status === 204 ? null : res.json();
};

const idOrden = (idNumerico) => `ORD-${String(idNumerico).padStart(6, '0')}`;

// Traduce la orden del backend (campos planos) al formato que usa la interfaz.
const ordenDesdeBackend = (o) => ({
  id: idOrden(o.id),
  cliente: { nombre: o.clienteNombre, correo: o.clienteCorreo },
  direccion: { calle: o.direccionCalle, comuna: o.direccionComuna },
  items: (o.items || []).map((i) => ({ id: i.productoId, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
  subtotal: o.subtotal,
  descuento: o.descuento,
  total: o.total,
  fecha: o.fecha
});

export const ApiService = {
  getProductos: async () => {
    try {
      const productos = await request('/productos');
      return actualizarImagenTortaManjar(productos);
    } catch {
      return productosLocales();
    }
  },

  createProducto: async (prod) => {
    try {
      return await request('/productos', { method: 'POST', body: JSON.stringify(prod) });
    } catch {
      const nuevo = { ...prod, id: Date.now() };
      guardar(LS_PRODUCTOS, [...productosLocales(), nuevo]);
      return nuevo;
    }
  },

  updateProducto: async (id, prod) => {
    try {
      return await request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(prod) });
    } catch {
      const actualizado = { ...prod, id };
      guardar(LS_PRODUCTOS, productosLocales().map((p) => (p.id === id ? actualizado : p)));
      return actualizado;
    }
  },

  deleteProducto: async (id) => {
    try {
      await request(`/productos/${id}`, { method: 'DELETE' });
    } catch {
      guardar(LS_PRODUCTOS, productosLocales().filter((p) => p.id !== id));
    }
  },

  crearOrden: async (orden) => {
    const payload = {
      clienteNombre: orden.cliente?.nombre ?? '',
      clienteCorreo: orden.cliente?.correo ?? '',
      direccionCalle: orden.direccion?.calle ?? '',
      direccionComuna: orden.direccion?.comuna ?? '',
      subtotal: orden.subtotal ?? orden.total,
      descuento: orden.descuento ?? 0,
      total: orden.total,
      items: (orden.items || []).map((i) => ({ productoId: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad }))
    };
    try {
      const guardada = await request('/ordenes', { method: 'POST', body: JSON.stringify(payload) });
      // Copia local: el panel admin (historial / boleta / reportes) lee de aquí.
      return guardarOrdenLocal(ordenDesdeBackend(guardada));
    } catch {
      return guardarOrdenLocal({
        ...orden,
        id: 'ORD-' + Date.now().toString().slice(-6),
        fecha: new Date().toISOString()
      });
    }
  }
};
