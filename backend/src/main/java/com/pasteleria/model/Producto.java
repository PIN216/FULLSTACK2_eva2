package com.pasteleria.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad JPA que representa un producto del catálogo de la Pastelería Mil Sabores.
 * Mapea la tabla 'productos' en la base de datos MySQL / H2.
 */
@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Boolean getEnOferta() {
        return enOferta;
    }

    public void setEnOferta(Boolean enOferta) {
        this.enOferta = enOferta;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }
}
