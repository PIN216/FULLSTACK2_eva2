package com.pasteleria.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entidad JPA que representa un producto del catálogo de la Pastelería Mil Sabores.
 * Mapea la tabla 'productos' en la base de datos MySQL.
 */
@Entity
@Table(name = "productos")
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre comercial del producto */
    private String nombre;

    /** Categoría a la que pertenece el producto */
    private String categoria;

    /** Precio base unitario en pesos chilenos (CLP) */
    private Double precio;

    /** Unidades disponibles en inventario */
    private Integer stock;

    /** Descripción de ingredientes y características del producto */
    @Column(length = 1000)
    private String descripcion;

    /** URL o ruta de la imagen ilustrativa del producto */
    @Column(length = 1000)
    private String imagen;

    /** Indica si el producto cuenta con descuento u oferta activa */
    private Boolean enOferta = false;

    /** Porcentaje de descuento aplicable en oferta (ej. 15.0 para 15%) */
    private Double descuento = 0.0;
}
