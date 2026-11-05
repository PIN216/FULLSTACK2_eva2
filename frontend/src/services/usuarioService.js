import { ApiService } from './api';

/**
 * Servicio de Usuarios y Autenticación.
 * Gestiona el inicio de sesión y registro de clientes.
 * Nota de seguridad: Las contraseñas se validan y cifran en el backend (BCrypt);
 * el cliente nunca almacena ni expone contraseñas en texto plano.
 */
export const UsuarioService = {
  /**
   * Obtiene la lista de usuarios registrados (requiere permisos administrativos).
   * @returns {Promise<Array>} Listado de usuarios sin campos sensibles.
   */
  getUsuarios: async () => ApiService.getUsuarios(),

  /**
   * Envía una solicitud de registro para crear una nueva cuenta de cliente.
   * @param {Object} datos - Objeto con { nombre, correo, password, fechaNacimiento, codigoPromo }.
   * @returns {Promise<Object>} Perfil de usuario creado.
   */
  registrar: async (datos) => ApiService.registrarUsuario(datos),

  /**
   * Autentica a un usuario con sus credenciales.
   * @param {string} correo - Correo electrónico registrado.
   * @param {string} password - Contraseña en texto plano para verificar contra el hash.
   * @returns {Promise<Object>} Objeto usuario autenticado con su rol y beneficios.
   */
  login: async (correo, password) => ApiService.login(correo, password)
};
