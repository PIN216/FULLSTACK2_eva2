import { ApiService } from './api';

export const ProductoService = {
  getProductos: async () => ApiService.getProductos(),
  getProductoById: async (id) => {
    const list = await ApiService.getProductos();
    return list.find(p => p.id === Number(id));
  },
  createProducto: async (p) => ApiService.createProducto(p),
  updateProducto: async (id, p) => ApiService.updateProducto(id, p),
  deleteProducto: async (id) => ApiService.deleteProducto(id)
};
