import { ProductoService } from './productoService';
import { OrdenService } from './ordenService';
import { UsuarioService } from './usuarioService';

export const ReporteService = {
  /**
   * Stock total del inventario: suma de las unidades de todos los productos.
   * @returns {Promise<number>} Unidades totales en stock.
   */
  getStockTotal: async () => {
    const prods = await ProductoService.getProductos();
    return prods.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  },

  /**
   * Cantidad total de usuarios registrados en el sistema.
   * @returns {Promise<number>} Número de usuarios.
   */
  getTotalUsuarios: async () => {
    const usuarios = await UsuarioService.getUsuarios();
    return usuarios.length;
  },

  getProductosCriticos: async () => {
    const prods = await ProductoService.getProductos();
    return prods.filter(p => (p.stock || 0) < 6);
  },
  getResumenMetricas: () => {
    const ordenes = OrdenService.getOrdenes();
    const totalRecaudado = ordenes.reduce((acc, o) => acc + (o.total || 0), 0);
    return {
      compras: ordenes.length,
      totalRecaudado
    };
  }
};
