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

    private static final String JSON = MediaType.APPLICATION_JSON_VALUE;

    @Test
    void catalogoInicialSeCarga() throws Exception {
        mvc.perform(get("/api/productos"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void categoriasInicialesSeCargan() throws Exception {
        mvc.perform(get("/api/categorias"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(4));
    }

    @Test
    void categoriaDuplicadaDa409() throws Exception {
        mvc.perform(post("/api/categorias").contentType(JSON).content("{\"nombre\":\"sin gluten\"}"))
           .andExpect(status().isConflict());
    }

    @Test
    void adminInicialPuedeIniciarSesionYNoExponeLaContrasena() throws Exception {
        mvc.perform(post("/api/usuarios/login").contentType(JSON)
                .content("{\"correo\":\"admin@milsabores.cl\",\"password\":\"Admin1234\"}"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.rol").value("admin"))
           .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void loginConClaveIncorrectaDa401() throws Exception {
        mvc.perform(post("/api/usuarios/login").contentType(JSON)
                .content("{\"correo\":\"admin@milsabores.cl\",\"password\":\"mala\"}"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void registroCalculaBeneficiosYFuerzaRolCliente() throws Exception {
        String body = """
            {"nombre":"Ana Mayor","correo":"ana.mayor@x.cl","password":"secreto1",
             "fechaNacimiento":"1950-01-01","codigoPromo":"felices50"}
            """;
        mvc.perform(post("/api/usuarios/registro").contentType(JSON).content(body))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.rol").value("cliente"))
           .andExpect(jsonPath("$.beneficios.length()").value(2))
           .andExpect(jsonPath("$.password").doesNotExist());
        // mismo correo otra vez
        mvc.perform(post("/api/usuarios/registro").contentType(JSON).content(body))
           .andExpect(status().isConflict());
    }

    @Test
    void crearOrdenConItemsDevuelveId() throws Exception {
        String body = """
            {"clienteNombre":"Pedro","clienteCorreo":"p@x.cl","direccionCalle":"Calle 1","direccionComuna":"Cerrillos",
             "subtotal":20000,"descuento":0,"total":20000,
             "items":[{"productoId":1,"nombre":"Torta","precio":20000,"cantidad":1}]}
            """;
        mvc.perform(post("/api/ordenes").contentType(JSON).content(body))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").exists())
           .andExpect(jsonPath("$.items.length()").value(1));
    }

    @Test
    void eliminarProductoInexistenteDa404() throws Exception {
        mvc.perform(delete("/api/productos/99999")).andExpect(status().isNotFound());
    }
}
