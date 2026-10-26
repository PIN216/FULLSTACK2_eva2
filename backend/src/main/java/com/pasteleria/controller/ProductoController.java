package com.pasteleria.controller;
import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) { this.repo = repo; }

    @GetMapping public List<Producto> listar() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@RequestBody Producto p) {
        p.setId(null); // el id lo genera la base de datos
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto p) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        p.setId(id);
        return repo.save(p);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        repo.deleteById(id);
    }
}
