package com.pasteleria.controller;

import com.pasteleria.model.Orden;
import com.pasteleria.service.OrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @GetMapping
    public List<Orden> listar() {
        return ordenService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<Orden> crearOrden(@RequestBody Orden orden) {
        Orden nueva = ordenService.registrarOrden(orden);
        return ResponseEntity.ok(nueva);
    }
}
