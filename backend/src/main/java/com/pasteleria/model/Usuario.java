package com.pasteleria.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA que representa a los usuarios del sistema (clientes,
 * administradores y vendedores).
 * Almacena credenciales seguras, rol y beneficios asociados a promociones.
 */
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
     * Se marca como WRITE_ONLY para garantizar que nunca sea serializada ni
     * expuesta en respuestas JSON.
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    /**
     * Rol de autorización en la plataforma ('ADMINISTRADOR', 'VENDEDOR' o
     * 'CLIENTE')
     */
    private String rol = "CLIENTE";

    /**
     * Fecha de nacimiento en formato ISO (AAAA-MM-DD), usada para validar
     * descuentos por edad
     */
    private String fechaNacimiento;

    /**
     * Lista de beneficios comerciales asignados al usuario (ej: 'MAYOR_50',
     * 'FELICES50').
     * Se cargan de forma EAGER para evaluar descuentos automáticamente en el
     * carrito.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_beneficios", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "beneficio")
    private List<String> beneficios = new ArrayList<>();

    public static String normalizarRol(String rol) {
        if (rol == null || rol.isBlank()) {
            return "CLIENTE";
        }
        String r = rol.trim().toUpperCase();
        if (r.contains("ADMIN")) {
            return "ADMINISTRADOR";
        }
        if (r.contains("VEND")) {
            return "VENDEDOR";
        }
        return "CLIENTE";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = normalizarRol(rol);
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public List<String> getBeneficios() {
        return beneficios;
    }

    public void setBeneficios(List<String> beneficios) {
        this.beneficios = beneficios != null ? beneficios : new ArrayList<>();
    }
}
