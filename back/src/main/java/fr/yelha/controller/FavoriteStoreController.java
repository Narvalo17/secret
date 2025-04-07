package fr.yelha.controller;

import fr.yelha.dto.FilterFavoriteDto;
import fr.yelha.model.FavoriteStore;
import fr.yelha.model.Store;
import fr.yelha.service.FavoriteStoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/favorite-stores")
@RequiredArgsConstructor
@Validated
@Tag(name = "Magasins favoris", description = "API de gestion des magasins favoris")
public class FavoriteStoreController {
    private final FavoriteStoreService favoriteStoreService;

    @Operation(summary = "Ajouter un magasin aux favoris", description = "Ajoute un magasin à la liste des favoris d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Magasin ajouté aux favoris")
    @ApiResponse(responseCode = "404", description = "Magasin ou utilisateur non trouvé")
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> saveFavoriteStore(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Parameter(description = "ID du magasin") @RequestParam Long storeId) {
        log.debug("FavoriteStore Service[post] : saveFavoriteStore - userId: {}, storeId: {}", userId, storeId);
        try {
            FavoriteStore favoriteStore = favoriteStoreService.saveFavoriteStore(storeId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", favoriteStore.getId());
            response.put("storeId", favoriteStore.getStore().getId());
            response.put("userId", favoriteStore.getUser().getId());
            response.put("createdAt", favoriteStore.getCreatedAt());
            response.put("updatedAt", favoriteStore.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'ajout aux favoris : {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @Operation(summary = "Supprimer un magasin des favoris", description = "Retire un magasin de la liste des favoris d'un utilisateur")
    @ApiResponse(responseCode = "204", description = "Magasin retiré des favoris")
    @ApiResponse(responseCode = "404", description = "Magasin ou utilisateur non trouvé")
    @DeleteMapping("/user/{userId}/store/{storeId}")
    public ResponseEntity<Void> deleteFavoriteStore(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Parameter(description = "ID du magasin") @PathVariable Long storeId) {
        log.debug("FavoriteStore Service[delete] : deleteFavoriteStore");
        favoriteStoreService.deleteFavoriteStore(storeId, userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtenir les magasins favoris", description = "Récupère la liste des magasins favoris d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des magasins favoris")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Store>> getFavoriteStoreListByUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        log.debug("FavoriteStore Service[get] : getFavoriteStoreListByUser");
        try {
            List<Store> stores = favoriteStoreService.getFavoriteStoresByUser(userId)
                .stream()
                .map(FavoriteStore::getStore)
                .collect(Collectors.toList());
            
            Page<Store> storePage = new PageImpl<>(
                stores,
                PageRequest.of(0, stores.size()),
                stores.size()
            );
            
            return ResponseEntity.ok(storePage);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la récupération des favoris : {}", e.getMessage());
            throw e;
        }
    }

    @Operation(summary = "Filtrer les magasins favoris", description = "Récupère la liste filtrée des magasins favoris d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste filtrée des magasins favoris")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @PostMapping("/user/{userId}/filters")
    public ResponseEntity<Page<Store>> getByFilters(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Valid @RequestBody List<FilterFavoriteDto> filterFavoriteDtos,
            @Parameter(description = "Taille de la page") @RequestParam(required = false, defaultValue = "20") int size,
            @Parameter(description = "Numéro de la page") @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(description = "Critères de tri") @RequestParam(required = false, defaultValue = "id,desc") String sort) {
        log.debug("FavoriteStore Service[post] : get by filters");
        List<Store> stores = favoriteStoreService.getFavoriteStoresByFilters(filterFavoriteDtos, size, page, sort, userId)
            .stream()
            .map(FavoriteStore::getStore)
            .collect(Collectors.toList());
        
        Page<Store> storePage = new PageImpl<>(
            stores,
            PageRequest.of(page, size),
            stores.size()
        );
        
        return ResponseEntity.ok(storePage);
    }
}
