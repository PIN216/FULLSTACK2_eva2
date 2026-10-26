package com.pasteleria.model;
import jakarta.persistence.Embeddable;
import lombok.Data;

/** Línea de detalle de una orden (producto, precio final pagado y cantidad). */
@Embeddable @Data
public class ItemOrden {
    private Long productoId;
    private String nombre;
    private Double precio;
    private Integer cantidad;
}
