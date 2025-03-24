package fr.yelha.controller;

import fr.yelha.dto.ShoppingCartDetailDto;
import fr.yelha.dto.ShoppingCartDto;
import fr.yelha.service.ShoppingCartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/shopping")
@RequiredArgsConstructor
@Validated
@Tag(name = "Shopping", description = "API de gestion des achats")
public class ShoppingController {
    private final ShoppingCartService shoppingCartService;

    @Operation(summary = "Ajouter un produit au panier", description = "Ajout d'un produit au panier d'achat")
    @ApiResponse(responseCode = "200", description = "Produit ajouté avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Produit non trouvé")
    @PostMapping("/cart/items/user/{userId}")
    public ResponseEntity<ShoppingCartDto> addItemToCart(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Valid @RequestBody ShoppingCartDetailDto detail) {
        log.debug("Shopping Service[post] : addItemToCart");
        return ResponseEntity.ok(shoppingCartService.addItemToCart(userId, detail.getProductId(), detail.getQuantity()));
    }

    @Operation(summary = "Supprimer un produit du panier", description = "Suppression d'un produit du panier d'achat")
    @ApiResponse(responseCode = "200", description = "Produit supprimé avec succès")
    @ApiResponse(responseCode = "404", description = "Produit non trouvé dans le panier")
    @DeleteMapping("/cart/items/{productId}/user/{userId}")
    public ResponseEntity<ShoppingCartDto> removeItemFromCart(
            @Parameter(description = "ID du produit à supprimer") @PathVariable Long productId,
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        log.debug("Shopping Service[delete] : removeItemFromCart");
        return ResponseEntity.ok(shoppingCartService.removeItemFromCart(userId, productId));
    }

    @Operation(summary = "Obtenir le panier", description = "Récupération du panier d'achat de l'utilisateur")
    @ApiResponse(responseCode = "200", description = "Panier récupéré avec succès")
    @ApiResponse(responseCode = "404", description = "Panier non trouvé")
    @GetMapping("/cart/user/{userId}")
    public ResponseEntity<ShoppingCartDto> getShoppingCart(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        log.debug("Shopping Service[get] : getShoppingCart");
        return ResponseEntity.ok(shoppingCartService.getCartByUser(userId));
    }
}
