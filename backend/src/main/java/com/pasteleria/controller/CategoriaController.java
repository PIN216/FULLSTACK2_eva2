package com.pasteleria.controller;

import com.pasteleria.model.Categoria;
import com.pasteleria.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Controlador REST para gestionar las operaciones CRUD de las categorías de productos.
 * Ruta base: /api/categorias
 */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repo;

    public CategoriaController(CategoriaRepository repo) {
        this.repo = repo;
    }

    /**
     * Obtiene la lista de todas las categorías registradas.
     * @return Lista de entidades Categoria.
     */
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
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }
        repo.deleteById(id);
    }
}
