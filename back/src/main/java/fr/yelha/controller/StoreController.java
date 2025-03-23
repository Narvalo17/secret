package fr.yelha.controller;

import fr.yelha.model.Store;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/store")
public class StoreController {

    @Operation(summary = "Create a Store", tags = {"Manage Store"}, responses = {
            @ApiResponse(responseCode = "201", description = "Store created"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<String> createStore(
            @Valid @RequestBody Store store,
            @RequestHeader HttpHeaders headers, BearerTokenAuthentication authentication) {
        log.debug("Store Service[post] : saveStore");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("");
    }

    @Operation(summary = "Update a Store", tags = {"Manage Store"}, responses = {
            @ApiResponse(responseCode = "200", description = "Store updated"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PutMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<String> updateStore(
            @PathVariable int id,
            @Valid @RequestBody Store store,
            @RequestHeader HttpHeaders headers, BearerTokenAuthentication authentication) {
        log.debug("Store Service[put] : updateStore");

        return ResponseEntity.status(HttpStatus.OK).body("");
    }

    @ResponseBody
    @Operation(summary = "Get list of Stores", tags = {"Manage Store"}, responses = {
            @ApiResponse(responseCode = "200", description = "Store list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping(value = "/stores")
    public ResponseEntity<List<Store>> getListStores(@RequestHeader HttpHeaders headers,
                                                          BearerTokenAuthentication authentication) {

        log.debug("Store Service[get] : getListStores");
        return ResponseEntity.status(HttpStatus.OK)
                .body(List.of(new Store()));
    }

    @ResponseBody
    @Operation(summary = "Delete a Store", tags = {"Manage Store"}, responses = {
            @ApiResponse(responseCode = "200", description = "Store deleted"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> deleteStore(@PathVariable int id,
                                                   @RequestHeader HttpHeaders headers,
                                                   BearerTokenAuthentication authentication) {
        log.debug("Store Service[delete] : deleteStore");

        return ResponseEntity.status(HttpStatus.OK).body("");
    }
}
