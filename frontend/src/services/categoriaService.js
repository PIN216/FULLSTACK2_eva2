import { ApiService } from './api';

// Las categorías viven en la base SQL del backend (se cargan con DataLoader al iniciar).
export const CategoriaService = {
  getCategorias: async () => ApiService.getCategorias(),
  createCategoria: async (cat) => ApiService.createCategoria(cat),
  deleteCategoria: async (id) => ApiService.deleteCategoria(id)
};
