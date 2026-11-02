package com.pasteleria.repository;
import com.pasteleria.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
/**implementacion categoria*/
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}
