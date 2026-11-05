package com.pasteleria.controller;

import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Controlador REST para la gestión de productos del catálogo.
 * Expone endpoints para operaciones CRUD consumidas por el frontend.
 * Ruta base: /api/productos
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    /**
     * Retorna la lista completa de productos disponibles.
     * @return List con todos los productos registrados.
     */
    @GetMapping
    public List<Producto> listar() {
        return repo.findAll();
    }

    /**
     * Obtiene los detalles de un producto por su identificador único.
     * @param id Identificador numérico del producto.
     * @return Objeto Producto correspondiente al id solicitado.
     * @throws ResponseStatusException HTTP 404 si el producto no existe.
     */
    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    /**
     * Registra un nuevo producto en el catálogo.
     * El ID es auto-generado por el motor de base de datos.
     * @param p Datos del producto a registrar.
     * @return El producto guardado con su ID asignado.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@RequestBody Producto p) {
        p.setId(null); // Garantiza que la persistencia genere un nuevo ID
        return repo.save(p);
    }

    /**
     * Actualiza la información de un producto existente.
     * @param id Identificador del producto a actualizar.
     * @param p Nuevos datos para el producto.
     * @return El producto actualizado.
     * @throws ResponseStatusException HTTP 404 si el producto no existe.
     */
    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto p) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        p.setId(id);
        return repo.save(p);
    }

    /**
     * Elimina un producto del catálogo por su ID.
     * @param id Identificador del producto a eliminar.
     * @throws ResponseStatusException HTTP 404 si el producto no existe.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repo.deleteById(id);
    }
}
