package com.pasteleria.service;

import com.pasteleria.model.Orden;
import com.pasteleria.repository.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    public List<Orden> listarTodas() {
        return ordenRepository.findAll();
    }

    public Orden registrarOrden(Orden o) {
        return ordenRepository.save(o);
    }
}
