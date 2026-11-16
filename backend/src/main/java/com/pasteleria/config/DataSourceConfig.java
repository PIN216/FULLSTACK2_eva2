package com.pasteleria.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

/**
 * Configuración resiliente del DataSource.
 * Intenta conectar primeramente al motor relacional MySQL 8.0 en localhost:3306.
 * Si el servicio local de MySQL se encuentra detenido o no disponible, activa
 * automáticamente la base de datos relacional H2 en memoria con compatibilidad MySQL,
 * asegurando que la aplicación Spring Boot inicie de manera inmediata y sin fallos
 * tanto en entornos de evaluación rápida ("Run Java") como en despliegues con MySQL activo.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/milsaboresbd?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Verificación de conectividad a MySQL con timeout corto (1.5 segundos)
        try {
            log.info("[BD] Verificando conectividad con servidor MySQL en {}", mysqlUrl);
            DriverManager.setLoginTimeout(2);
            try (Connection conn = DriverManager.getConnection(mysqlUrl, username, password)) {
                log.info("[BD] Conexión establecida con éxito. Utilizando base de datos MySQL (milsaboresbd).");
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(mysqlUrl);
                config.setUsername(username);
                config.setPassword(password);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
                config.setPoolName("HikariPool-MySQL");
                return new HikariDataSource(config);
            }
        } catch (Exception e) {
            log.warn("[BD] Servidor MySQL no disponible en localhost:3306 ({}).", e.getMessage());
            log.info("[BD] Activando contingencia automática con base de datos H2 en memoria (modo MySQL). La aplicación funcionará sin interrupciones.");

            HikariConfig h2Config = new HikariConfig();
            h2Config.setJdbcUrl("jdbc:h2:mem:milsaboresbd;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL");
            h2Config.setDriverClassName("org.h2.Driver");
            h2Config.setUsername("sa");
            h2Config.setPassword("");
            h2Config.setPoolName("HikariPool-H2-Fallback");
            return new HikariDataSource(h2Config);
        }
    }
}
