import { ApiService } from './api';

export const ProductoService = {
  getProductos: async () => ApiService.getProductos(),
  getProductoById: async (id) => {
    const list = await ApiService.getProductos();
    return list.find(p => p.id === Number(id));
  },
  createProducto: async (p) => ApiService.createProducto(p),
  deleteProducto: async (id) => ApiService.deleteProducto(id)
};
