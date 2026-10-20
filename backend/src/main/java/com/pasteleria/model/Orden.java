package com.pasteleria.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity @Table(name = "ordenes") @Data
public class Orden {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clienteNombre;
    private String clienteCorreo;
    private Double total;
    private LocalDateTime fecha = LocalDateTime.now();
}
