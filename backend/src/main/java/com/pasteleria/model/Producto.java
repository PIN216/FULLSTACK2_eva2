package com.pasteleria.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name = "productos") @Data
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String categoria;
    private Double precio;
    private Integer stock;
    private String descripcion;
    private String imagen;
    private Boolean enOferta;
    private Double descuento;
}
