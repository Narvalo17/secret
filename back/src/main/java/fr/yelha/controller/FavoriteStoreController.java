package fr.yelha.controller;

import fr.yelha.model.FavoriteStore;
import fr.yelha.model.dto.FilterFavoriteDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/favorite-store")
public class FavoriteStoreController {

    @Operation(summary = "Add a FavoriteStore", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "Store added"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<String> saveFavoriteStore(
            @Valid @RequestBody FavoriteStore favoriteStore,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("FavoriteStore Service[post] : saveFavoriteStore");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Delete a FavoriteStore", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "FavoriteStore deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @DeleteMapping(value = "/{idStore}")
    @ResponseBody
    public ResponseEntity<String> deleteFavoriteStore(
            @PathVariable int idStore,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("FavoriteStore Service[delete] : deleteFavoriteStore");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Get list FavoriteStore by User", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "FavoriteStore list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping(value = "/favorite-stores")
    @ResponseBody
    public ResponseEntity<List<FavoriteStore>> getFavoriteStoreListByRestaurant(@RequestHeader HttpHeaders headers, BearerTokenAuthentication authentication) {
        log.debug("FavoriteStore Service[get] : getFavoriteStoreListByRestaurant");

        return ResponseEntity.ok().body(List.of(new FavoriteStore()));
    }

    @Operation(summary = "Get FavoriteStore list using filters", tags = {"FavoriteStore"}, responses = {
            @ApiResponse(responseCode = "200", description = "FavoriteStore list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/filters")
    @ResponseBody
    public ResponseEntity<List<FavoriteStore>> getByFilters(
            @RequestBody List<FilterFavoriteDto> filterFavoriteDtos,
            @RequestParam(required = false, defaultValue = "20", name = "size") String size,
            @RequestParam(required = false, defaultValue = "0", name = "page") String page,
            @RequestParam(required = false, defaultValue = "id,desc", name = "sort") String sort,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("FavoriteStore Service[post] : get by filters");

        return ResponseEntity.ok()
                .body(List.of(new FavoriteStore()));
    }
}
