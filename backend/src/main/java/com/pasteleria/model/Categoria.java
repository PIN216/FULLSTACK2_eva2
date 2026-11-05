package com.pasteleria.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entidad JPA que representa una categoría de productos en el sistema.
 * Permite agrupar los pasteles, postres y alternativas saludables.
 */
@Entity
@Table(name = "categorias")
@Data
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre único de la categoría (ej: "Tortas Circulares", "Sin Azúcar") */
    @Column(nullable = false, unique = true)
    private String nombre;

    /** Breve descripción del tipo de productos agrupados en esta categoría */
    @Column(length = 500)
    private String descripcion;
}
