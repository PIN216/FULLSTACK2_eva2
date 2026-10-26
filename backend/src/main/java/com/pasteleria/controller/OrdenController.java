package com.pasteleria.controller;
import com.pasteleria.model.Orden;
import com.pasteleria.repository.OrdenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/ordenes")
public class OrdenController {
    private final OrdenRepository repo;

    public OrdenController(OrdenRepository repo) { this.repo = repo; }

    @GetMapping public List<Orden> listar() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Orden obtener(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Orden crear(@RequestBody Orden o) {
        if (o.getTotal() == null || o.getTotal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El total de la orden es obligatorio");
        }
        o.setId(null);
        return repo.save(o);
    }
}
