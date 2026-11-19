package com.pasteleria.controller;

import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Controlador REST para la gestión de productos del catálogo.
 * Expone endpoints para operaciones CRUD consumidas por el frontend.
 * Ruta base: /api/v1/productos y /api/productos
 */
@Tag(name = "2. Catálogo de Productos", description = "Endpoints para operaciones CRUD del catálogo de productos y tortas.")
@RestController
@RequestMapping({"/api/v1/productos", "/api/productos"})
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    /**
     * Retorna la lista completa de productos disponibles.
     * @return List con todos los productos registrados.
     */
    @Operation(summary = "Listar todos los productos", description = "Retorna el catálogo completo de productos disponibles.")
    @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente")
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
    @Operation(summary = "Obtener producto por ID", description = "Retorna los detalles de un producto según su identificador único.")
    @ApiResponse(responseCode = "200", description = "Producto encontrado")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @GetMapping("/{id}")
    public Producto obtener(@Parameter(description = "ID del producto", required = true) @PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    /**
     * Registra un nuevo producto en el catálogo.
     * El ID es auto-generado por el motor de base de datos.
     * @param p Datos del producto a registrar.
     * @return El producto guardado con su ID asignado.
     */
    @Operation(summary = "Crear nuevo producto", description = "Registra un nuevo producto en el catálogo. Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "201", description = "Producto creado exitosamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR)")
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
    @Operation(summary = "Actualizar producto existente", description = "Actualiza los campos de un producto por su ID. Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR)")
    @PutMapping("/{id}")
    public Producto actualizar(@Parameter(description = "ID del producto", required = true) @PathVariable Long id, @RequestBody Producto p) {
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
    @Operation(summary = "Eliminar producto por ID", description = "Elimina un producto del inventario. Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "204", description = "Producto eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR)")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@Parameter(description = "ID del producto a eliminar", required = true) @PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repo.deleteById(id);
    }
}
