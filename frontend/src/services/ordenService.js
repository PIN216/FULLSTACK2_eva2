import { ApiService } from './api';

/**
 * Servicio de Órdenes de Compra.
 * Gestiona la emisión y recuperación de pedidos tanto desde la API REST
 * como desde la persistencia de respaldo en localStorage.
 */
export const OrdenService = {
  /**
   * Obtiene la lista histórica de órdenes guardadas localmente.
   * @returns {Array} Lista de órdenes.
   */
  getOrdenes: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_ordenes")) || [];
    } catch {
      return [];
    }
  },

  /**
   * Envía una orden completa para su registro y persistencia.
   * @param {Object} orden - Datos del pedido, cliente y artículos.
   * @returns {Promise<Object>} Orden registrada.
   */
  crearOrden: async (orden) => ApiService.crearOrden(orden),

  /**
   * Busca una orden específica por su identificador.
   * @param {number|string} id - Identificador de la orden.
   * @returns {Object|undefined} Orden localizada.
   */
  getOrdenById: (id) => {
    const list = OrdenService.getOrdenes();
    return list.find(o => o.id === id);
  }
};
