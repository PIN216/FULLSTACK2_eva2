package com.pasteleria.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

/**
 * Componente embebible que representa cada línea de detalle dentro de una orden de compra.
 * Registra el producto adquirido, el precio unitario pactado al momento de compra y la cantidad.
 */
@Embeddable
@Data
public class ItemOrden {

    /** Identificador del producto comprado */
    private Long productoId;

    /** Nombre o descripción del producto */
    private String nombre;

    /** Precio unitario final cobrado al momento de realizar la transacción */
    private Double precio;

    /** Cantidad de unidades adquiridas */
    private Integer cantidad;
}
