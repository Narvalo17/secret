package fr.yelha.controller;

import fr.yelha.model.ShoppingCart;
import fr.yelha.model.ShoppingcartDetail;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/shopping")
public class ShoppingController {

    @Operation(summary = "Add a product to shopping cart", tags = {"Shopping"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product added"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<String> saveShoppingCartDetail(
            @Valid @RequestBody ShoppingcartDetail shoppingcartdetail,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Shopping Service[post] : saveShoppingCartDetail");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Delete a product from a Shopping cart", tags = {"Shopping"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @DeleteMapping(value = "/{idProduct}")
    @ResponseBody
    public ResponseEntity<String> deleteShoppingCartDetails(
            @PathVariable int idProduct,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Shopping Service[delete] : deleteShoppingCartDetails");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Get ShoppingCart", tags = {"Shopping"}, responses = {
            @ApiResponse(responseCode = "200", description = "shopping cart"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping(value = "/")
    @ResponseBody
    public ResponseEntity<ShoppingCart> getShoppingCart(@RequestHeader HttpHeaders headers, BearerTokenAuthentication authentication) {
        log.debug("Shopping Service[get] : getShoppingCart");

        return ResponseEntity.ok().body(new ShoppingCart());
    }

}
