import { ProductoService } from './productoService';
import { OrdenService } from './ordenService';

export const ReporteService = {
  getProductosCriticos: async () => {
    const prods = await ProductoService.getProductos();
    return prods.filter(p => (p.stock || 0) < 6);
  },
  getResumenMétricas: () => {
    const ordenes = OrdenService.getOrdenes();
    const totalRecaudado = ordenes.reduce((acc, o) => acc + (o.total || 0), 0);
    return {
      compras: ordenes.length,
      totalRecaudado
    };
  }
};
