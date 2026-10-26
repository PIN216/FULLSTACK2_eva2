package com.pasteleria.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "ordenes") @Data
public class Orden {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clienteNombre;
    private String clienteCorreo;
    private String direccionCalle;
    private String direccionComuna;
    private Double subtotal;
    private Double descuento;
    private Double total;
    private LocalDateTime fecha;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "orden_items", joinColumns = @JoinColumn(name = "orden_id"))
    private List<ItemOrden> items = new ArrayList<>();

    @PrePersist
    void antesDeGuardar() {
        if (fecha == null) fecha = LocalDateTime.now();
    }
}
