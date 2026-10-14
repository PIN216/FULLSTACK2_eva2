const API_URL = "http://localhost:8080/api";

export const ApiService = {
  getProductos: async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      if (!res.ok) throw new Error("Error en servidor");
      return await res.json();
    } catch {
      const local = localStorage.getItem("pms_productos");
      return local ? JSON.parse(local) : [];
    }
  },

  createProducto: async (producto) => {
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
      });
      return await res.json();
    } catch {
      const list = JSON.parse(localStorage.getItem("pms_productos")) || [];
      const nuevo = { ...producto, id: Date.now() };
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
      const nueva = { ...orden, id: "ORD-" + Date.now().toString().slice(-6) };
      list.push(nueva);
      localStorage.setItem("pms_ordenes", JSON.stringify(list));
      return nueva;
    }
  }
};
