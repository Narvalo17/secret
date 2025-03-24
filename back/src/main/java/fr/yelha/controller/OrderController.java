package fr.yelha.controller;

import fr.yelha.dto.OrderDto;
import fr.yelha.model.enums.OrderStatus;
import fr.yelha.service.OrderService;
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
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Validated
@Tag(name = "Commandes", description = "API de gestion des commandes")
public class OrderController {
    private final OrderService orderService;

    @Operation(summary = "Créer une commande", description = "Création d'une nouvelle commande")
    @ApiResponse(responseCode = "200", description = "Commande créée avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Utilisateur ou magasin non trouvé")
    @PostMapping("/user/{userId}")
    public ResponseEntity<OrderDto> createOrder(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Valid @RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.createOrder(orderDto, userId));
    }

    @Operation(summary = "Mettre à jour une commande", description = "Modification d'une commande existante")
    @ApiResponse(responseCode = "200", description = "Commande mise à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(
            @Parameter(description = "ID de la commande") @PathVariable Long id,
            @Valid @RequestBody OrderDto orderDto) {
        return ResponseEntity.ok(orderService.updateOrder(id, orderDto));
    }

    @Operation(summary = "Obtenir une commande", description = "Récupération des détails d'une commande")
    @ApiResponse(responseCode = "200", description = "Commande trouvée")
    @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @Parameter(description = "ID de la commande") @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @Operation(summary = "Obtenir les commandes d'un utilisateur", description = "Récupération de la liste paginée des commandes d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des commandes récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderDto>> getOrdersByUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId, pageable));
    }

    @Operation(summary = "Obtenir les commandes d'un magasin", description = "Récupération de la liste paginée des commandes d'un magasin")
    @ApiResponse(responseCode = "200", description = "Liste des commandes récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @GetMapping("/store/{storeId}")
    public ResponseEntity<Page<OrderDto>> getOrdersByStore(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByStore(storeId, pageable));
    }

    @Operation(summary = "Mettre à jour le statut d'une commande", description = "Modification du statut d'une commande")
    @ApiResponse(responseCode = "200", description = "Statut de la commande mis à jour avec succès")
    @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @Parameter(description = "ID de la commande") @PathVariable Long id,
            @Parameter(description = "Nouveau statut") @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @Operation(summary = "Supprimer une commande", description = "Suppression d'une commande")
    @ApiResponse(responseCode = "204", description = "Commande supprimée avec succès")
    @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID de la commande") @PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Annuler une commande", description = "Annulation d'une commande")
    @ApiResponse(responseCode = "200", description = "Commande annulée avec succès")
    @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    @ApiResponse(responseCode = "400", description = "Impossible d'annuler la commande")
    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(
            @Parameter(description = "ID de la commande") @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
} 