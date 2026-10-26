import React, { useState, useEffect } from 'react';
import { UsuarioService } from '../../services/usuarioService';

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    UsuarioService.getUsuarios().then(setUsuarios);
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <h5 className="fw-bold text-brown mb-3">Gestión de Usuarios</h5>
      <ul className="list-group">
        {usuarios.map((u, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{u.nombre}</strong> ({u.correo})
              <br /><small className="text-muted">Rol: {u.rol || 'cliente'}</small>
            </div>
            <span className="badge bg-info">{u.beneficios?.length || 0} beneficios</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
