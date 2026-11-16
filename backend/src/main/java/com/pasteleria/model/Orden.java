package com.pasteleria.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
@NoArgsConstructor
@AllArgsConstructor
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

    @PrePersist
    void antesDeGuardar() {
        if (fecha == null) fecha = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteCorreo() {
        return clienteCorreo;
    }

    public void setClienteCorreo(String clienteCorreo) {
        this.clienteCorreo = clienteCorreo;
    }

    public String getDireccionCalle() {
        return direccionCalle;
    }

    public void setDireccionCalle(String direccionCalle) {
        this.direccionCalle = direccionCalle;
    }

    public String getDireccionComuna() {
        return direccionComuna;
    }

    public void setDireccionComuna(String direccionComuna) {
        this.direccionComuna = direccionComuna;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getDescuento() {
        return descuento;
    }

    public void setDescuento(Double descuento) {
        this.descuento = descuento;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public List<ItemOrden> getItems() {
        return items;
    }

    public void setItems(List<ItemOrden> items) {
        this.items = items != null ? items : new ArrayList<>();
    }
}
