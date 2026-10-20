package com.pasteleria.controller;
import com.pasteleria.model.Producto;
import com.pasteleria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/productos")
public class ProductoController {
    @Autowired private ProductoRepository repo;

    @GetMapping public List<Producto> listar() { return repo.findAll(); }
    @PostMapping public Producto crear(@RequestBody Producto p) { return repo.save(p); }
    @DeleteMapping("/{id}") public void eliminar(@PathVariable Long id) { repo.deleteById(id); }
}
