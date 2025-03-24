package fr.yelha.controller;

import fr.yelha.dto.FilterFavoriteDto;
import fr.yelha.model.FavoriteStore;
import fr.yelha.service.FavoriteStoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/favorite-stores")
@RequiredArgsConstructor
public class FavoriteStoreController {
    private final FavoriteStoreService favoriteStoreService;

    @Operation(summary = "Add a FavoriteStore", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "Store added"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FavoriteStore> saveFavoriteStore(
            @RequestParam Long storeId,
            Authentication authentication) {
        log.debug("FavoriteStore Service[post] : saveFavoriteStore");
        return ResponseEntity.ok(favoriteStoreService.saveFavoriteStore(storeId, Long.parseLong(authentication.getName())));
    }

    @Operation(summary = "Delete a FavoriteStore", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "FavoriteStore deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @DeleteMapping("/{idStore}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteFavoriteStore(
            @PathVariable Long idStore,
            Authentication authentication) {
        log.debug("FavoriteStore Service[delete] : deleteFavoriteStore");
        favoriteStoreService.deleteFavoriteStore(idStore, Long.parseLong(authentication.getName()));
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get list FavoriteStore by User", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "FavoriteStore list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<FavoriteStore>> getFavoriteStoreListByUser(Authentication authentication) {
        log.debug("FavoriteStore Service[get] : getFavoriteStoreListByUser");
        return ResponseEntity.ok(favoriteStoreService.getFavoriteStoresByUser(Long.parseLong(authentication.getName())));
    }

    @Operation(summary = "Get FavoriteStore list using filters", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "FavoriteStore list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping("/filters")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<FavoriteStore>> getByFilters(
            @RequestBody List<FilterFavoriteDto> filterFavoriteDtos,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "id,desc") String sort,
            Authentication authentication) {
        log.debug("FavoriteStore Service[post] : get by filters");
        return ResponseEntity.ok(favoriteStoreService.getFavoriteStoresByFilters(
                filterFavoriteDtos, size, page, sort, Long.parseLong(authentication.getName())));
    }
}
