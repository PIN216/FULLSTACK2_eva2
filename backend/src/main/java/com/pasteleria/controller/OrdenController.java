package com.pasteleria.controller;

import com.pasteleria.model.Orden;
import com.pasteleria.repository.OrdenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Controlador REST para el procesamiento y consulta de órdenes de compra.
 * Permite a los clientes generar pedidos y al administrador consultar el historial.
 * Ruta base: /api/ordenes
 */
@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenRepository repo;

    public OrdenController(OrdenRepository repo) {
        this.repo = repo;
    }

    /**
     * Lista todas las órdenes registradas en el sistema.
     * @return Lista de órdenes con sus respectivos items de compra.
     */
    @GetMapping
    public List<Orden> listar() {
        return repo.findAll();
    }

    /**
     * Obtiene una orden por su identificador.
     * @param id Identificador de la orden.
     * @return Entidad Orden con información de entrega e items.
     * @throws ResponseStatusException HTTP 404 si la orden no existe.
     */
    @GetMapping("/{id}")
    public Orden obtener(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));
    }

    /**
     * Registra una nueva orden de compra emitida desde el proceso de checkout.
     * @param o Datos de la orden (cliente, dirección, items y montos calculados).
     * @return La orden persistida con su ID y fecha de registro.
     * @throws ResponseStatusException HTTP 400 si el monto total es inválido.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Orden crear(@RequestBody Orden o) {
        if (o.getTotal() == null || o.getTotal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El total de la orden es obligatorio");
        }
        o.setId(null);
        return repo.save(o);
    }
}
