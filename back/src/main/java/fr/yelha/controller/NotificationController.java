package fr.yelha.controller;

import fr.yelha.dto.NotificationDto;
import fr.yelha.service.NotificationService;
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
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Validated
@Tag(name = "Notifications", description = "API de gestion des notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Operation(summary = "Créer une notification", description = "Création d'une nouvelle notification pour un utilisateur")
    @ApiResponse(responseCode = "200", description = "Notification créée avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @PostMapping("/user/{userId}")
    public ResponseEntity<NotificationDto> createNotification(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            @Valid @RequestBody NotificationDto notificationDto) {
        return ResponseEntity.ok(notificationService.createNotification(notificationDto, userId));
    }

    @Operation(summary = "Mettre à jour une notification", description = "Modification d'une notification existante")
    @ApiResponse(responseCode = "200", description = "Notification mise à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Notification non trouvée")
    @PutMapping("/{id}")
    public ResponseEntity<NotificationDto> updateNotification(
            @Parameter(description = "ID de la notification") @PathVariable Long id,
            @Valid @RequestBody NotificationDto notificationDto) {
        return ResponseEntity.ok(notificationService.updateNotification(id, notificationDto));
    }

    @Operation(summary = "Obtenir une notification", description = "Récupération des détails d'une notification")
    @ApiResponse(responseCode = "200", description = "Notification trouvée")
    @ApiResponse(responseCode = "404", description = "Notification non trouvée")
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDto> getNotification(
            @Parameter(description = "ID de la notification") @PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @Operation(summary = "Obtenir les notifications d'un utilisateur", description = "Récupération de la liste paginée des notifications d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des notifications récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationDto>> getNotificationsByUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId, pageable));
    }

    @Operation(summary = "Obtenir les notifications non lues", description = "Récupération de la liste des notifications non lues d'un utilisateur")
    @ApiResponse(responseCode = "200", description = "Liste des notifications non lues")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @Operation(summary = "Marquer une notification comme lue", description = "Marque une notification comme lue")
    @ApiResponse(responseCode = "200", description = "Notification marquée comme lue")
    @ApiResponse(responseCode = "404", description = "Notification non trouvée")
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(
            @Parameter(description = "ID de la notification") @PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @Operation(summary = "Marquer toutes les notifications comme lues", description = "Marque toutes les notifications d'un utilisateur comme lues")
    @ApiResponse(responseCode = "200", description = "Toutes les notifications marquées comme lues")
    @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé")
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Supprimer une notification", description = "Suppression d'une notification")
    @ApiResponse(responseCode = "204", description = "Notification supprimée avec succès")
    @ApiResponse(responseCode = "404", description = "Notification non trouvée")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @Parameter(description = "ID de la notification") @PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
} 