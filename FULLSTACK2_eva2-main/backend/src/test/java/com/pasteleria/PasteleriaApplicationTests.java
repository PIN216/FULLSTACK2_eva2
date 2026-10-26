package com.pasteleria;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PasteleriaApplicationTests {
    @Autowired MockMvc mvc;

    @Test
    void catalogoInicialSeCarga() throws Exception {
        mvc.perform(get("/api/productos"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void crearOrdenConItemsDevuelveId() throws Exception {
        String body = """
            {"clienteNombre":"Pedro","clienteCorreo":"p@x.cl","direccionCalle":"Calle 1","direccionComuna":"Cerrillos",
             "subtotal":20000,"descuento":0,"total":20000,
             "items":[{"productoId":1,"nombre":"Torta","precio":20000,"cantidad":1}]}
            """;
        mvc.perform(post("/api/ordenes").contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").exists())
           .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void eliminarProductoInexistenteDa404() throws Exception {
        mvc.perform(delete("/api/productos/99999")).andExpect(status().isNotFound());
    }
}
