package com.pasteleria.controller;

import com.pasteleria.model.Categoria;
import com.pasteleria.repository.CategoriaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Controlador REST para gestionar las operaciones CRUD de las categorías de productos.
 * Ruta base: /api/v1/categorias y /api/categorias
 */
@Tag(name = "3. Categorías", description = "Endpoints para la gestión y clasificación de categorías de la pastelería.")
@RestController
@RequestMapping({"/api/v1/categorias", "/api/categorias"})
public class CategoriaController {

    private final CategoriaRepository repo;

    public CategoriaController(CategoriaRepository repo) {
        this.repo = repo;
    }

    /**
     * Obtiene la lista de todas las categorías registradas.
     * @return Lista de entidades Categoria.
     */
    @Operation(summary = "Listar categorías", description = "Retorna todas las categorías de productos configuradas.")
    @ApiResponse(responseCode = "200", description = "Lista de categorías obtenida con éxito")
    @GetMapping
    public List<Categoria> listar() {
        return repo.findAll();
    }

    /**
     * Crea una nueva categoría validando que su nombre no esté vacío ni duplicado.
     * @param c Datos de la categoría a crear.
     * @return Categoría creada con su identificador generado.
     * @throws ResponseStatusException HTTP 400 si el nombre es nulo/vacío, o HTTP 409 si ya existe.
     */
    @Operation(summary = "Crear nueva categoría", description = "Registra una nueva categoría en el sistema. Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "201", description = "Categoría creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Nombre de categoría inválido o faltante")
    @ApiResponse(responseCode = "409", description = "Nombre de categoría duplicado")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria crear(@RequestBody Categoria c) {
        if (c.getNombre() == null || c.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la categoría es obligatorio");
        }
        c.setNombre(c.getNombre().trim());
        if (repo.existsByNombreIgnoreCase(c.getNombre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una categoría con ese nombre");
        }
        c.setId(null);
        return repo.save(c);
    }

    /**
     * Elimina una categoría existente por su identificador.
     * @param id Identificador numérico de la categoría.
     * @throws ResponseStatusException HTTP 404 si la categoría no existe.
     */
    @Operation(summary = "Eliminar categoría", description = "Elimina una categoría por su identificador único. Requiere rol ADMINISTRADOR.")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada")
    @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    @ApiResponse(responseCode = "403", description = "Acceso denegado (requiere rol ADMINISTRADOR)")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@Parameter(description = "ID de la categoría a eliminar", required = true) @PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }
        repo.deleteById(id);
    }
}
