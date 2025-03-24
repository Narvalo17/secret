package fr.yelha.controller;

import fr.yelha.dto.ShoppingCartDto;
import fr.yelha.service.ShoppingCartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@Tag(name = "Paniers", description = "API de gestion des paniers d'achat")
public class CartController {
    private final ShoppingCartService shoppingCartService;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    @Operation(summary = "Obtenir le panier d'un utilisateur", description = "Récupération du panier d'achat d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Panier trouvé")
    @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    public ResponseEntity<ShoppingCartDto> getCartByUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        return ResponseEntity.ok(shoppingCartService.getCartByUser(userId));
    }

    @PostMapping("/user/{userId}/items")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    @Operation(summary = "Ajouter un article au panier", description = "Ajout d'un produit au panier d'achat")
    @ApiResponse(responseCode = "200", description = "Article ajouté avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    @ApiResponse(responseCode = "404", description = "Utilisateur ou produit non trouvé")
    public ResponseEntity<ShoppingCartDto> addItemToCart(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Parameter(description = "ID du produit") @RequestParam Long productId,
            @Parameter(description = "Quantité à ajouter") @RequestParam Integer quantity) {
        return ResponseEntity.ok(shoppingCartService.addItemToCart(userId, productId, quantity));
    }

    @PutMapping("/user/{userId}/items/{productId}")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    @Operation(summary = "Mettre à jour la quantité d'un article", description = "Modification de la quantité d'un produit dans le panier")
    @ApiResponse(responseCode = "200", description = "Quantité mise à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    @ApiResponse(responseCode = "404", description = "Utilisateur ou produit non trouvé")
    public ResponseEntity<ShoppingCartDto> updateCartItemQuantity(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Parameter(description = "ID du produit") @PathVariable Long productId,
            @Parameter(description = "Nouvelle quantité") @RequestParam Integer quantity) {
        return ResponseEntity.ok(shoppingCartService.updateCartItemQuantity(userId, productId, quantity));
    }

    @DeleteMapping("/user/{userId}/items/{productId}")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    @Operation(summary = "Supprimer un article du panier", description = "Suppression d'un produit du panier")
    @ApiResponse(responseCode = "200", description = "Article supprimé avec succès")
    @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    @ApiResponse(responseCode = "404", description = "Utilisateur ou produit non trouvé")
    public ResponseEntity<ShoppingCartDto> removeItemFromCart(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Parameter(description = "ID du produit") @PathVariable Long productId) {
        return ResponseEntity.ok(shoppingCartService.removeItemFromCart(userId, productId));
    }

    @DeleteMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    @Operation(summary = "Vider le panier", description = "Suppression de tous les articles du panier")
    @ApiResponse(responseCode = "204", description = "Panier vidé avec succès")
    @ApiResponse(responseCode = "403", description = "Accès non autorisé")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    public ResponseEntity<Void> clearCart(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        shoppingCartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
} 