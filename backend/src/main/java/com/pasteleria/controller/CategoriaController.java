package com.pasteleria.controller;
import com.pasteleria.model.Categoria;
import com.pasteleria.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/categorias")
public class CategoriaController {
    private final CategoriaRepository repo;

    public CategoriaController(CategoriaRepository repo) { this.repo = repo; }

    @GetMapping public List<Categoria> listar() { return repo.findAll(); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
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

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        repo.deleteById(id);
    }
}
