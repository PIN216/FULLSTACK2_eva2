export const UsuarioService = {
  getUsuarios: () => {
    try {
      return JSON.parse(localStorage.getItem("pms_usuarios")) || [
        { correo: "admin@milsabores.cl", password: "Admin1234", nombre: "Administrador General", rol: "admin" }
      ];
    } catch {
      return [];
    }
  },
  createUsuario: (u) => {
    const list = UsuarioService.getUsuarios();
    list.push(u);
    localStorage.setItem("pms_usuarios", JSON.stringify(list));
    return u;
  },
  buscarUsuario: (correo) => {
    const list = UsuarioService.getUsuarios();
    return list.find(u => u.correo.toLowerCase() === correo.toLowerCase());
  }
};
