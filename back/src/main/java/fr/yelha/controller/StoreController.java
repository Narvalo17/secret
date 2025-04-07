package fr.yelha.controller;

import fr.yelha.dto.StoreDto;
import fr.yelha.model.enums.StoreType;
import fr.yelha.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@Tag(name = "Magasins", description = "API pour gérer les magasins")
public class StoreController {
    private final StoreService storeService;

    @PostMapping
    @Operation(summary = "Créer un magasin", description = "Crée un nouveau magasin")
    @ApiResponse(responseCode = "201", description = "Magasin créé avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    public ResponseEntity<StoreDto> createStore(@Valid @RequestBody StoreDto storeDto) {
        return new ResponseEntity<>(storeService.createStore(storeDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un magasin", description = "Met à jour un magasin existant")
    @ApiResponse(responseCode = "200", description = "Magasin mis à jour avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    public ResponseEntity<StoreDto> updateStore(
            @Parameter(description = "ID du magasin") @PathVariable Long id,
            @Valid @RequestBody StoreDto storeDto) {
        return ResponseEntity.ok(storeService.updateStore(id, storeDto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un magasin", description = "Récupère un magasin par son ID")
    @ApiResponse(responseCode = "200", description = "Magasin trouvé")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    public ResponseEntity<StoreDto> getStore(
            @Parameter(description = "ID du magasin") @PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping
    @Operation(summary = "Obtenir tous les magasins", description = "Récupère la liste des magasins paginée")
    @ApiResponse(responseCode = "200", description = "Liste des magasins récupérée avec succès")
    public ResponseEntity<Page<StoreDto>> getAllStores(Pageable pageable) {
        return ResponseEntity.ok(storeService.getAllStores(pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des magasins", description = "Recherche des magasins par nom ou description")
    @ApiResponse(responseCode = "200", description = "Résultats de recherche récupérés avec succès")
    public ResponseEntity<Page<StoreDto>> searchStores(
            @Parameter(description = "Terme de recherche") @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(storeService.searchStores(query, pageable));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Obtenir les magasins par type", description = "Récupère les magasins par type")
    @ApiResponse(responseCode = "200", description = "Liste des magasins récupérée avec succès")
    public ResponseEntity<Page<StoreDto>> getStoresByType(
            @Parameter(description = "Type de magasin") @PathVariable StoreType type,
            Pageable pageable) {
        return ResponseEntity.ok(storeService.getStoresByType(type, pageable));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un magasin", description = "Supprime un magasin existant")
    @ApiResponse(responseCode = "204", description = "Magasin supprimé avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    public ResponseEntity<Void> deleteStore(
            @Parameter(description = "ID du magasin") @PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}
