package com.pasteleria.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA que representa una orden de compra o pedido realizado por un cliente.
 * Almacena los datos de envío, montos calculados y el desglose de productos adquiridos.
 */
@Entity
@Table(name = "ordenes")
@Data
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre del cliente receptor */
    private String clienteNombre;

    /** Correo de contacto del cliente */
    private String clienteCorreo;

    /** Dirección y número de entrega */
    private String direccionCalle;

    /** Comuna de despacho */
    private String direccionComuna;

    /** Monto subtotal antes de aplicar rebajas */
    private Double subtotal;

    /** Monto total descontado por promociones o cupones */
    private Double descuento;

    /** Monto final neto a pagar */
    private Double total;

    /** Fecha y hora en que se emite la orden */
    private LocalDateTime fecha;

    /** Colección de productos y cantidades que componen el pedido */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "orden_items", joinColumns = @JoinColumn(name = "orden_id"))
    private List<ItemOrden> items = new ArrayList<>();

    /**
     * Asigna automáticamente la marca de tiempo actual si no fue especificada antes de guardar.
     */
    @PrePersist
    void antesDeGuardar() {
        if (fecha == null) fecha = LocalDateTime.now();
    }
}
