package fr.yelha.controller;

import fr.yelha.dto.StoreDto;
import fr.yelha.service.StoreService;
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

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@Validated
@Tag(name = "Magasins", description = "API de gestion des magasins")
public class StoreController {
    private final StoreService storeService;

    @Operation(summary = "Créer un magasin", description = "Création d'un nouveau magasin")
    @ApiResponse(responseCode = "200", description = "Magasin créé avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @PostMapping("/user/{userId}")
    public ResponseEntity<StoreDto> createStore(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Valid @RequestBody StoreDto storeDto) {
        return ResponseEntity.ok(storeService.createStore(storeDto, userId));
    }

    @Operation(summary = "Mettre à jour un magasin", description = "Modification d'un magasin existant")
    @ApiResponse(responseCode = "200", description = "Magasin mis à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @PutMapping("/{id}")
    public ResponseEntity<StoreDto> updateStore(
            @Parameter(description = "ID du magasin") @PathVariable Long id,
            @Valid @RequestBody StoreDto storeDto) {
        return ResponseEntity.ok(storeService.updateStore(id, storeDto));
    }

    @Operation(summary = "Obtenir un magasin", description = "Récupération des détails d'un magasin")
    @ApiResponse(responseCode = "200", description = "Magasin trouvé")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStore(
            @Parameter(description = "ID du magasin") @PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @Operation(summary = "Obtenir tous les magasins", description = "Récupération de la liste paginée de tous les magasins")
    @ApiResponse(responseCode = "200", description = "Liste des magasins récupérée avec succès")
    @GetMapping
    public ResponseEntity<Page<StoreDto>> getAllStores(Pageable pageable) {
        return ResponseEntity.ok(storeService.getAllStores(pageable));
    }

    @Operation(summary = "Obtenir les magasins par catégorie", description = "Récupération de la liste paginée des magasins d'une catégorie")
    @ApiResponse(responseCode = "200", description = "Liste des magasins récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Catégorie non trouvée")
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<Page<StoreDto>> getStoresByCategory(
            @Parameter(description = "Nom de la catégorie") @PathVariable String categoryName,
            Pageable pageable) {
        return ResponseEntity.ok(storeService.getStoresByCategory(categoryName, pageable));
    }

    @Operation(summary = "Rechercher des magasins", description = "Recherche de magasins par mot-clé")
    @ApiResponse(responseCode = "200", description = "Résultats de la recherche récupérés avec succès")
    @GetMapping("/search")
    public ResponseEntity<Page<StoreDto>> searchStores(
            @Parameter(description = "Terme de recherche") @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(storeService.searchStores(query, pageable));
    }

    @Operation(summary = "Supprimer un magasin", description = "Suppression d'un magasin")
    @ApiResponse(responseCode = "204", description = "Magasin supprimé avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(
            @Parameter(description = "ID du magasin") @PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Mettre à jour le statut d'un magasin", description = "Activation ou désactivation d'un magasin")
    @ApiResponse(responseCode = "200", description = "Statut du magasin mis à jour avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @PutMapping("/{id}/status")
    public ResponseEntity<StoreDto> updateStoreStatus(
            @Parameter(description = "ID du magasin") @PathVariable Long id,
            @Parameter(description = "Nouveau statut (true = actif, false = inactif)") @RequestParam boolean isActive) {
        return ResponseEntity.ok(storeService.updateStoreStatus(id, isActive));
    }
}
