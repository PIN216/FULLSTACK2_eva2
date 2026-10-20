const API_URL = "http://localhost:8080/api";

export const ApiService = {
  getProductos: async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      if (!res.ok) throw new Error("Error en servidor");
      return await res.json();
    } catch {
      const local = localStorage.getItem("pms_productos");
      return local ? JSON.parse(local) : [
        { id: 1, nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", precio: 45000, stock: 12, descripcion: "Capas de ganache con avellanas.", imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600" },
        { id: 2, nombre: "Torta Circular de Manjar", categoria: "Tortas Circulares", precio: 42000, stock: 4, enOferta: true, descuento: 15, descripcion: "Receta tradicional chilena con manjar casero.", imagen: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600" },
        { id: 3, nombre: "Cheesecake Sin Azúcar", categoria: "Sin Azúcar", precio: 47000, stock: 5, descripcion: "Suave y cremoso postre saludable.", imagen: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600" },
        { id: 4, nombre: "Brownie Sin Gluten", categoria: "Sin Gluten", precio: 4000, stock: 25, enOferta: true, descuento: 10, descripcion: "Rico chocolate amargo apto para celíacos.", imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600" }
      ];
    }
  },
  createProducto: async (prod) => {
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod)
      });
      return await res.json();
    } catch {
      const list = JSON.parse(localStorage.getItem("pms_productos")) || [];
      const nuevo = { ...prod, id: Date.now() };
      list.push(nuevo);
      localStorage.setItem("pms_productos", JSON.stringify(list));
      return nuevo;
    }
  },
  deleteProducto: async (id) => {
    try {
      await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
    } catch {
      const list = JSON.parse(localStorage.getItem("pms_productos")) || [];
      localStorage.setItem("pms_productos", JSON.stringify(list.filter(p => p.id !== id)));
    }
  },
  crearOrden: async (orden) => {
    try {
      const res = await fetch(`${API_URL}/ordenes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden)
      });
      return await res.json();
    } catch {
      const list = JSON.parse(localStorage.getItem("pms_ordenes")) || [];
      const nueva = { ...orden, id: "ORD-" + Date.now().toString().slice(-6), fecha: new Date().toISOString() };
      list.push(nueva);
      localStorage.setItem("pms_ordenes", JSON.stringify(list));
      return nueva;
    }
  }
};
