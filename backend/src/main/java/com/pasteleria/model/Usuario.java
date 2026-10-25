package com.pasteleria.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "usuarios") @Data
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    @Column(nullable = false, unique = true)
    private String correo;

    /** Se guarda cifrada (BCrypt). WRITE_ONLY: nunca se devuelve en las respuestas JSON. */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String rol = "cliente";
    private String fechaNacimiento;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_beneficios", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "beneficio")
    private List<String> beneficios = new ArrayList<>();
}
