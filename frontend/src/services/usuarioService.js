import { ApiService } from './api';

// Los usuarios viven en la base SQL del backend. La contraseña se valida y se cifra allá:
// el navegador nunca recibe ni guarda contraseñas.
export const UsuarioService = {
  getUsuarios: async () => ApiService.getUsuarios(),
  registrar: async (datos) => ApiService.registrarUsuario(datos),
  login: async (correo, password) => ApiService.login(correo, password)
};
