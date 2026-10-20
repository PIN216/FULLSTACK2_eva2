export const CategoriaService = {
  getCategorias: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_categorias")) || [
        { id: 1, nombre: "Tortas Cuadradas", descripcion: "Tradicionales y para celebraciones grandes" },
        { id: 2, nombre: "Tortas Circulares", descripcion: "Clásicas con manjar casero" },
        { id: 3, nombre: "Sin Azúcar", descripcion: "Opciones saludables endulzadas naturalmente" },
        { id: 4, nombre: "Sin Gluten", descripcion: "100% libres de gluten, certificadas" }
      ];
    } catch {
      return [];
    }
  },
  createCategoria: (cat) => {
    const list = CategoriaService.getCategorias();
    const item = { ...cat, id: Date.now() };
    list.push(item);
    localStorage.setItem("pms_categorias", JSON.stringify(list));
    return item;
  },
  deleteCategoria: (id) => {
    const list = CategoriaService.getCategorias().filter(c => c.id !== Number(id));
    localStorage.setItem("pms_categorias", JSON.stringify(list));
    return true;
  }
};
