package fr.yelha.controller;

import fr.yelha.dto.StoreHoursDto;
import fr.yelha.service.StoreHoursService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/store-hours")
@RequiredArgsConstructor
@Validated
@Tag(name = "Horaires des magasins", description = "API de gestion des horaires d'ouverture des magasins")
public class StoreHoursController {
    private final StoreHoursService storeHoursService;

    @Operation(summary = "Créer les horaires d'un magasin", description = "Création des horaires d'ouverture pour un magasin")
    @ApiResponse(responseCode = "200", description = "Horaires créés avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @PostMapping("/store/{storeId}")
    public ResponseEntity<StoreHoursDto> createStoreHours(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            @Valid @RequestBody StoreHoursDto storeHoursDto) {
        return ResponseEntity.ok(storeHoursService.createStoreHours(storeHoursDto));
    }

    @Operation(summary = "Mettre à jour les horaires", description = "Modification des horaires d'ouverture d'un magasin")
    @ApiResponse(responseCode = "200", description = "Horaires mis à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Horaires non trouvés")
    @PutMapping("/{id}")
    public ResponseEntity<StoreHoursDto> updateStoreHours(
            @Parameter(description = "ID des horaires") @PathVariable Long id,
            @Valid @RequestBody StoreHoursDto storeHoursDto) {
        return ResponseEntity.ok(storeHoursService.updateStoreHours(id, storeHoursDto));
    }

    @Operation(summary = "Obtenir les horaires", description = "Récupération des horaires d'ouverture par ID")
    @ApiResponse(responseCode = "200", description = "Horaires trouvés")
    @ApiResponse(responseCode = "404", description = "Horaires non trouvés")
    @GetMapping("/{id}")
    public ResponseEntity<StoreHoursDto> getStoreHours(
            @Parameter(description = "ID des horaires") @PathVariable Long id) {
        return ResponseEntity.ok(storeHoursService.getStoreHoursById(id));
    }

    @Operation(summary = "Obtenir les horaires d'un magasin", description = "Récupération de tous les horaires d'ouverture d'un magasin")
    @ApiResponse(responseCode = "200", description = "Liste des horaires récupérée avec succès")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<StoreHoursDto>> getStoreHoursByStore(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId) {
        return ResponseEntity.ok(storeHoursService.getStoreHoursByStore(storeId));
    }

    @Operation(summary = "Obtenir les horaires par jour", description = "Récupération des horaires d'ouverture d'un magasin pour un jour spécifique")
    @ApiResponse(responseCode = "200", description = "Horaires trouvés")
    @ApiResponse(responseCode = "404", description = "Magasin ou horaires non trouvés")
    @GetMapping("/store/{storeId}/day/{dayOfWeek}")
    public ResponseEntity<StoreHoursDto> getStoreHoursByDay(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            @Parameter(description = "Jour de la semaine") @PathVariable DayOfWeek dayOfWeek) {
        return ResponseEntity.ok(storeHoursService.getStoreHoursByDay(storeId, dayOfWeek));
    }

    @Operation(summary = "Mettre à jour les horaires spéciaux", description = "Modification des horaires spéciaux d'un magasin pour un jour donné")
    @ApiResponse(responseCode = "200", description = "Horaires spéciaux mis à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Données invalides")
    @ApiResponse(responseCode = "404", description = "Magasin non trouvé")
    @PutMapping("/store/{storeId}/day/{dayOfWeek}/special")
    public ResponseEntity<StoreHoursDto> updateSpecialHours(
            @Parameter(description = "ID du magasin") @PathVariable Long storeId,
            @Parameter(description = "Jour de la semaine") @PathVariable DayOfWeek dayOfWeek,
            @Parameter(description = "Heure d'ouverture") @RequestParam LocalTime openTime,
            @Parameter(description = "Heure de fermeture") @RequestParam LocalTime closeTime,
            @Parameter(description = "Note (optionnelle)") @RequestParam(required = false) String note) {
        storeHoursService.updateSpecialHours(storeId, dayOfWeek, openTime, closeTime, note);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Supprimer les horaires", description = "Suppression des horaires d'ouverture d'un magasin")
    @ApiResponse(responseCode = "204", description = "Horaires supprimés avec succès")
    @ApiResponse(responseCode = "404", description = "Horaires non trouvés")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStoreHours(
            @Parameter(description = "ID des horaires") @PathVariable Long id) {
        storeHoursService.deleteStoreHours(id);
        return ResponseEntity.noContent().build();
    }
} 