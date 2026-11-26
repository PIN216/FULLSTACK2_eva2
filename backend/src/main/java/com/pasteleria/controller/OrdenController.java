package com.pasteleria.controller;

import com.pasteleria.model.Orden;
import com.pasteleria.repository.OrdenRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Controlador REST para el procesamiento y consulta de órdenes/boletas de compra.
 * Permite a los clientes generar pedidos y al Administrador o Vendedor consultar el historial y detalle.
 * Rutas: /api/v1/ordenes, /api/ordenes, /api/v1/boletas, /api/boletas
 */
@Tag(name = "4. Boletas y Órdenes", description = "Endpoints para registro y consulta de boletas de compra y sus detalles de ítems.")
@RestController
@RequestMapping({"/api/v1/ordenes", "/api/ordenes", "/api/v1/boletas", "/api/boletas"})
public class OrdenController {

    private final OrdenRepository repo;

    public OrdenController(OrdenRepository repo) {
        this.repo = repo;
    }

    /**
     * Lista todas las órdenes registradas en el sistema.
     * Accesible por roles ADMINISTRADOR y VENDEDOR.
     * @return Lista de órdenes con sus respectivos items de compra.
     */
    @Operation(summary = "Listar todas las órdenes/boletas", description = "Retorna el historial completo de órdenes emitidas. Permitido para roles ADMINISTRADOR y VENDEDOR.")
    @ApiResponse(responseCode = "200", description = "Historial de órdenes obtenido")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR o VENDEDOR)")
    @GetMapping
    public List<Orden> listar() {
        return repo.findAll();
    }

    /**
     * Obtiene una orden/boleta por su identificador.
     * Permite a los vendedores y administradores ver el detalle completo de la boleta.
     * @param id Identificador de la orden.
     * @return Entidad Orden con información de entrega e items.
     * @throws ResponseStatusException HTTP 404 si la orden no existe.
     */
    @Operation(summary = "Obtener detalle de orden/boleta", description = "Retorna los datos del cliente, dirección, totales y detalle de ítems de la orden.")
    @ApiResponse(responseCode = "200", description = "Orden encontrada")
    @ApiResponse(responseCode = "404", description = "Orden no encontrada")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR o VENDEDOR)")
    @GetMapping("/{id}")
    public Orden obtener(@Parameter(description = "ID de la orden", required = true) @PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));
    }

    /**
     * Registra una nueva orden de compra emitida desde el proceso de checkout.
     * @param o Datos de la orden (cliente, dirección, items y montos calculados).
     * @return La orden persistida con su ID y fecha de registro.
     * @throws ResponseStatusException HTTP 400 si el monto total es inválido.
     */
    @Operation(summary = "Crear orden de compra / boleta", description = "Registra una nueva orden de compra emitida desde la tienda online por un cliente.")
    @ApiResponse(responseCode = "201", description = "Orden creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Monto total inválido o datos de orden incompletos")
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
