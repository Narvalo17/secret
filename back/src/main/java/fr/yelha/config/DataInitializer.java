package fr.yelha.config;

import fr.yelha.dto.CategoryDto;
import fr.yelha.model.enums.CategoryType;
import fr.yelha.model.enums.StoreType;
import fr.yelha.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

/**
 * Classe d'initialisation des données par défaut dans l'application.
 * Elle est exécutée au démarrage de l'application.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final CategoryService categoryService;
    private final Environment environment;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Ne pas initialiser les données en mode test
            if (isTestProfile()) {
                log.info("Mode test détecté, l'initialisation des données est ignorée");
                return;
            }
            
            log.info("Initialisation des catégories de magasins par défaut");
            initStoreCategories();
            log.info("Initialisation des données terminée avec succès");
        };
    }

    private void initStoreCategories() {
        // Créer les catégories pour les types de magasins
        Stream.of(StoreType.values()).forEach(storeType -> {
            String categoryName = storeType.getDisplayName();
            
            // Vérifier si la catégorie existe déjà
            List<CategoryDto> existingCategories = categoryService.getAllCategories();
            boolean categoryExists = existingCategories.stream()
                    .anyMatch(cat -> cat.getName().equalsIgnoreCase(categoryName));
            
            if (!categoryExists) {
                CategoryDto categoryDto = new CategoryDto();
                categoryDto.setName(categoryName);
                categoryDto.setSlug(categoryName.toLowerCase().replace(' ', '-').replace('é', 'e').replace('è', 'e').replace('à', 'a'));
                categoryDto.setDescription("Catégorie pour les magasins de type " + categoryName);
                categoryDto.setType(CategoryType.STORE);
                categoryDto.setIsActive(true);
                
                try {
                    categoryService.createCategory(categoryDto);
                    log.info("Catégorie créée : {}", categoryName);
                } catch (Exception e) {
                    log.error("Erreur lors de la création de la catégorie {}: {}", categoryName, e.getMessage());
                }
            } else {
                log.info("La catégorie {} existe déjà", categoryName);
            }
        });
    }

    private boolean isTestProfile() {
        return Arrays.asList(environment.getActiveProfiles()).contains("test");
    }
} 