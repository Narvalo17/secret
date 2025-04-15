package fr.yelha.config;

import fr.yelha.model.enums.StoreType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

/**
 * Classe d'initialisation des données par défaut dans l'application.
 * Elle est exécutée au démarrage de l'application.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final Environment environment;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Ne pas initialiser les données en mode test
            if (isTestProfile()) {
                log.info("Mode test détecté, l'initialisation des données est ignorée");
                return;
            }
            
            log.info("Types de magasins disponibles : {}", Arrays.toString(StoreType.values()));
            log.info("Initialisation des données terminée avec succès");
        };
    }

    private boolean isTestProfile() {
        return Arrays.asList(environment.getActiveProfiles()).contains("test");
    }
} 