package com.pasteleria.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA que representa a los usuarios del sistema (clientes y administradores).
 * Almacena credenciales seguras, rol y beneficios asociados a promociones.
 */
@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre completo del usuario */
    private String nombre;

    /** Correo electrónico único utilizado como identificador de inicio de sesión */
    @Column(nullable = false, unique = true)
    private String correo;

    /**
     * Contraseña almacenada con hash seguro (BCrypt).
     * Se marca como WRITE_ONLY para garantizar que nunca sea serializada ni expuesta en respuestas JSON.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    /** Rol de autorización en la plataforma ('cliente' o 'admin') */
    private String rol = "cliente";

    /** Fecha de nacimiento en formato ISO (AAAA-MM-DD), usada para validar descuentos por edad */
    private String fechaNacimiento;

    /**
     * Lista de beneficios comerciales asignados al usuario (ej: 'MAYOR_50', 'FELICES50').
     * Se cargan de forma EAGER para evaluar descuentos automáticamente en el carrito.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_beneficios", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "beneficio")
    private List<String> beneficios = new ArrayList<>();
}
