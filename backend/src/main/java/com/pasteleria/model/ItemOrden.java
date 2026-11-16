package com.pasteleria.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Componente embebible que representa cada línea de detalle dentro de una orden de compra.
 * Registra el producto adquirido, el precio unitario pactado al momento de compra y la cantidad.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrden {

    /** Identificador del producto comprado */
    private Long productoId;

    /** Nombre o descripción del producto */
    private String nombre;

    /** Precio unitario final cobrado al momento de realizar la transacción */
    private Double precio;

    /** Cantidad de unidades adquiridas */
    private Integer cantidad;

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
