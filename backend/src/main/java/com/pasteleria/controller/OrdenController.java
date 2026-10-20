package com.pasteleria.controller;
import com.pasteleria.model.Orden;
import com.pasteleria.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/ordenes")
public class OrdenController {
    @Autowired private OrdenRepository repo;

    @GetMapping public List<Orden> listar() { return repo.findAll(); }
    @PostMapping public Orden crear(@RequestBody Orden o) { return repo.save(o); }
}
