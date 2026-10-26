const DEFAULT_CATEGORIES = [
  { id: 1, nombre: "Tortas Cuadradas", descripcion: "Tradicionales y para celebraciones grandes" },
  { id: 2, nombre: "Tortas Circulares", descripcion: "Recetas chilenas clásicas con manjar casero" },
  { id: 3, nombre: "Sin Azúcar", descripcion: "Opciones saludables endulzadas naturalmente" },
  { id: 4, nombre: "Sin Gluten", descripcion: "100% libres de gluten, certificadas" }
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    nombre: "Torta Cuadrada de Chocolate",
    categoria: "Tortas Cuadradas",
    precio: 45000,
    enOferta: false,
    descuento: 0,
    stock: 12,
    descripcion: "Capas de ganache con toque de avellanas. Personalizable con mensajes.",
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
  },
  {
    id: 2,
    nombre: "Torta Circular de Manjar",
    categoria: "Tortas Circulares",
    precio: 42000,
    enOferta: true,
    descuento: 15,
    stock: 8,
    descripcion: "Tradicional receta chilena con manjar casero y nueces seleccionadas.",
    imagen: "https://www.elingenio.cl/productos/bizcocho-manjar-lucuma.jpg"
  },
  {
    id: 3,
    nombre: "Cheesecake Sin Azúcar",
    categoria: "Sin Azúcar",
    precio: 47000,
    enOferta: false,
    descuento: 0,
    stock: 5,
    descripcion: "Suave y cremoso, perfecto para disfrutar de un postre saludable sin culpas.",
    imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"
  },
  {
    id: 4,
    nombre: "Brownie Sin Gluten",
    categoria: "Sin Gluten",
    precio: 4000,
    enOferta: true,
    descuento: 10,
    stock: 25,
    descripcion: "Rico y denso chocolate amargo, apto para celíacos sin sacrificar sabor.",
    imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"
  }
];

const initStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (!localStorage.getItem("pms_productos")) {
      localStorage.setItem("pms_productos", JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem("pms_categorias")) {
      localStorage.setItem("pms_categorias", JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem("pms_usuarios")) {
      localStorage.setItem("pms_usuarios", JSON.stringify([
        { correo: "admin@milsabores.cl", password: "Admin1234", nombre: "Administrador General", rol: "admin" }
      ]));
    }
    if (!localStorage.getItem("pms_ordenes")) {
      localStorage.setItem("pms_ordenes", JSON.stringify([]));
    }
  }
};
initStorage();

export const DataService = {
  getProductos: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_productos")) || DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },
  
  getProductoById: (id) => {
    const list = DataService.getProductos();
    return list.find((p) => p.id === Number(id));
  },

  createProducto: (nuevo) => {
    const list = DataService.getProductos();
    const item = { ...nuevo, id: Date.now() };
    list.push(item);
    localStorage.setItem("pms_productos", JSON.stringify(list));
    return item;
  },

  updateProducto: (id, actualizacion) => {
    const list = DataService.getProductos();
    const index = list.findIndex((p) => p.id === Number(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...actualizacion };
      localStorage.setItem("pms_productos", JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  deleteProducto: (id) => {
    const list = DataService.getProductos().filter((p) => p.id !== Number(id));
    localStorage.setItem("pms_productos", JSON.stringify(list));
    return true;
  },

  getCategorias: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_categorias")) || DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  getUsuarios: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_usuarios")) || [];
    } catch {
      return [];
    }
  },

  createUsuario: (user) => {
    const list = DataService.getUsuarios();
    list.push(user);
    localStorage.setItem("pms_usuarios", JSON.stringify(list));
    return user;
  },

  buscarUsuario: (correo) => {
    const list = DataService.getUsuarios();
    return list.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
  },

  getOrdenes: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_ordenes")) || [];
    } catch {
      return [];
    }
  },

  createOrden: (orden) => {
    const list = DataService.getOrdenes();
    const nuevaOrden = {
      ...orden,
      id: "ORD-" + Date.now().toString().slice(-6),
      fecha: new Date().toISOString()
    };
    list.push(nuevaOrden);
    localStorage.setItem("pms_ordenes", JSON.stringify(list));
    return nuevaOrden;
  }
};
