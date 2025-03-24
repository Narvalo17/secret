package fr.yelha.controller;

import fr.yelha.dto.PromotionDto;
import fr.yelha.service.PromotionService;
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
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@Validated
@Tag(name = "Promotions", description = "API de gestion des promotions")
public class PromotionController {
    private final PromotionService promotionService;

    @Operation(summary = "Créer une promotion", description = "Création d'une nouvelle promotion pour un magasin")
    @ApiResponse(responseCode = "200", description = "Promotion créée avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @PostMapping("/store/{storeId}")
    public ResponseEntity<PromotionDto> createPromotion(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            @Valid @RequestBody PromotionDto promotionDto) {
        return ResponseEntity.ok(promotionService.createPromotion(promotionDto));
    }

    @Operation(summary = "Mettre à jour une promotion", description = "Modification d'une promotion existante")
    @ApiResponse(responseCode = "200", description = "Promotion mise à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Promotion non trouvée")
    @PutMapping("/{id}")
    public ResponseEntity<PromotionDto> updatePromotion(
            @Parameter(description = "ID de la promotion") @PathVariable Long id,
            @Valid @RequestBody PromotionDto promotionDto) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, promotionDto));
    }

    @Operation(summary = "Obtenir une promotion", description = "Récupération des détails d'une promotion")
    @ApiResponse(responseCode = "200", description = "Promotion trouvée")
    @ApiResponse(responseCode = "404", description = "Promotion non trouvée")
    @GetMapping("/{id}")
    public ResponseEntity<PromotionDto> getPromotion(
            @Parameter(description = "ID de la promotion") @PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    @Operation(summary = "Obtenir toutes les promotions", description = "Récupération de la liste paginée de toutes les promotions")
    @ApiResponse(responseCode = "200", description = "Liste des promotions récupérée avec succès")
    @GetMapping
    public ResponseEntity<Page<PromotionDto>> getAllPromotions(Pageable pageable) {
        return ResponseEntity.ok(promotionService.getAllPromotions(pageable));
    }

    @Operation(summary = "Obtenir les promotions actives", description = "Récupération de la liste paginée des promotions actives")
    @ApiResponse(responseCode = "200", description = "Liste des promotions actives récupérée avec succès")
    @GetMapping("/active")
    public ResponseEntity<Page<PromotionDto>> getActivePromotions(Pageable pageable) {
        return ResponseEntity.ok(promotionService.getActivePromotions(pageable));
    }

    @Operation(summary = "Obtenir les promotions d'un magasin", description = "Récupération de la liste paginée des promotions d'un magasin")
    @ApiResponse(responseCode = "200", description = "Liste des promotions récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @GetMapping("/store/{storeId}")
    public ResponseEntity<Page<PromotionDto>> getPromotionsByStore(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            Pageable pageable) {
        return ResponseEntity.ok(promotionService.getPromotionsByStore(storeId, pageable));
    }

    @Operation(summary = "Obtenir les promotions actives d'un magasin", description = "Récupération de la liste paginée des promotions actives d'un magasin")
    @ApiResponse(responseCode = "200", description = "Liste des promotions actives récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @GetMapping("/store/{storeId}/active")
    public ResponseEntity<Page<PromotionDto>> getActivePromotionsByStore(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            Pageable pageable) {
        return ResponseEntity.ok(promotionService.getActivePromotionsByStore(storeId, pageable));
    }

    @Operation(summary = "Valider une promotion", description = "Validation d'une promotion par son code")
    @ApiResponse(responseCode = "200", description = "Promotion validée avec succès")
    @ApiResponse(responseCode = "400", description = "Code de promotion invalide")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @PostMapping("/validate")
    public ResponseEntity<PromotionDto> validatePromotion(
            @Parameter(description = "Code de la promotion") @RequestParam String code,
            @Parameter(description = "ID du magasin") @RequestParam Long storeId) {
        return ResponseEntity.ok(promotionService.validatePromotion(code, storeId));
    }

    @Operation(summary = "Supprimer une promotion", description = "Suppression d'une promotion")
    @ApiResponse(responseCode = "204", description = "Promotion supprimée avec succès")
    @ApiResponse(responseCode = "404", description = "Promotion non trouvée")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(
            @Parameter(description = "ID de la promotion") @PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
} 