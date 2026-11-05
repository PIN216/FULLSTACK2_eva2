import { ApiService } from './api';

/**
 * Servicio de Productos para el frontend.
 * Conecta las vistas de catálogo y administración con la capa de API.
 */
export const ProductoService = {
  /**
   * Obtiene todos los productos registrados.
   * @returns {Promise<Array>} Listado de productos.
   */
  getProductos: async () => ApiService.getProductos(),

  /**
   * Busca un producto por su ID numérico.
   * @param {number|string} id - Identificador del producto.
   * @returns {Promise<Object|undefined>} Objeto producto encontrado.
   */
  getProductoById: async (id) => {
    const list = await ApiService.getProductos();
    return list.find(p => p.id === Number(id));
  },

  /**
   * Registra un nuevo producto en el catálogo.
   * @param {Object} p - Datos del producto a crear.
   * @returns {Promise<Object>} Producto creado.
   */
  createProducto: async (p) => ApiService.createProducto(p),

  /**
   * Actualiza los datos de un producto existente.
   * @param {number|string} id - ID del producto.
   * @param {Object} p - Datos modificados.
   * @returns {Promise<Object>} Producto actualizado.
   */
  updateProducto: async (id, p) => ApiService.updateProducto(id, p),

  /**
   * Elimina un producto del catálogo.
   * @param {number|string} id - ID del producto a eliminar.
   * @returns {Promise<boolean>} Éxito de la operación.
   */
  deleteProducto: async (id) => ApiService.deleteProducto(id)
};
