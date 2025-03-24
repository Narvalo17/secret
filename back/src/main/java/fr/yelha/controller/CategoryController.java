package fr.yelha.controller;

import fr.yelha.dto.CategoryDto;
import fr.yelha.model.enums.CategoryType;
import fr.yelha.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Validated
@Tag(name = "Catégories", description = "API de gestion des catégories")
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(summary = "Créer une catégorie", description = "Création d'une nouvelle catégorie")
    @ApiResponse(responseCode = "200", description = "Catégorie créée avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.createCategory(categoryDto));
    }

    @Operation(summary = "Mettre à jour une catégorie", description = "Modification d'une catégorie existante")
    @ApiResponse(responseCode = "200", description = "Catégorie mise à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @Parameter(description = "ID de la catégorie") @PathVariable Long id,
            @Valid @RequestBody CategoryDto categoryDto) {
        return ResponseEntity.ok(categoryService.updateCategory(id, categoryDto));
    }

    @Operation(summary = "Obtenir une catégorie", description = "Récupération des détails d'une catégorie")
    @ApiResponse(responseCode = "200", description = "Catégorie trouvée")
    @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategory(
            @Parameter(description = "ID de la catégorie") @PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @Operation(summary = "Obtenir toutes les catégories", description = "Récupération de la liste complète des catégories")
    @ApiResponse(responseCode = "200", description = "Liste des catégories récupérée avec succès")
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @Operation(summary = "Obtenir les catégories par type", description = "Récupération des catégories filtrées par type")
    @ApiResponse(responseCode = "200", description = "Liste des catégories récupérée avec succès")
    @GetMapping("/type/{type}")
    public ResponseEntity<Page<CategoryDto>> getCategoriesByType(
            @Parameter(description = "Type de catégorie") @PathVariable CategoryType type,
            Pageable pageable) {
        return ResponseEntity.ok(categoryService.getCategoriesByType(type, pageable));
    }

    @Operation(summary = "Obtenir les sous-catégories", description = "Récupération des sous-catégories d'une catégorie parente")
    @ApiResponse(responseCode = "200", description = "Liste des sous-catégories récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Catégorie parente non trouvée")
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<CategoryDto>> getSubCategories(
            @Parameter(description = "ID de la catégorie parente") @PathVariable Long parentId) {
        return ResponseEntity.ok(categoryService.getSubCategories(parentId));
    }

    @Operation(summary = "Supprimer une catégorie", description = "Suppression d'une catégorie")
    @ApiResponse(responseCode = "204", description = "Catégorie supprimée avec succès")
    @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    @ApiResponse(responseCode = "400", description = "Impossible de supprimer une catégorie avec des sous-catégories")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "ID de la catégorie") @PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
} 