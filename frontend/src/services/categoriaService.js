import { ApiService } from './api';

/**
 * Servicio de Categorías de Productos.
 * Permite listar y administrar las categorías ofrecidas en la pastelería.
 */
export const CategoriaService = {
  /**
   * Obtiene todas las categorías disponibles.
   * @returns {Promise<Array>} Listado de categorías.
   */
  getCategorias: async () => ApiService.getCategorias(),

  /**
   * Registra una nueva categoría en el sistema.
   * @param {Object} cat - Datos de la categoría ({ nombre, descripcion }).
   * @returns {Promise<Object>} Categoría guardada.
   */
  createCategoria: async (cat) => ApiService.createCategoria(cat),

  /**
   * Elimina una categoría del sistema por su ID.
   * @param {number|string} id - Identificador de la categoría.
   * @returns {Promise<boolean>} Resultado de la eliminación.
   */
  deleteCategoria: async (id) => ApiService.deleteCategoria(id)
};
