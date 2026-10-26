import { ApiService } from './api';

export const OrdenService = {
  getOrdenes: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_ordenes")) || [];
    } catch {
      return [];
    }
  },
  crearOrden: async (orden) => ApiService.crearOrden(orden),
  getOrdenById: (id) => {
    const list = OrdenService.getOrdenes();
    return list.find(o => o.id === id);
  }
};
