package fr.yelha.controller;

import fr.yelha.model.Product;
import fr.yelha.model.dto.FilterProductDto;
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
@RequestMapping("admin/product")
public class ProductController {

    @Operation(summary = "Add a Product", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product added"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/")
    @ResponseBody
    public ResponseEntity<String> saveProduct(
            @Valid @RequestBody Product Product,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Product Service[post] : saveProduct");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Update a Product", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product updated"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PutMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<String> updateProduct(
            @PathVariable int id,
            @Valid @RequestBody Product Product,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Product Service[put] : updateProduct");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Delete a Product", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @DeleteMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteProduct(
            @PathVariable int id,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Product Service[delete] : deleteProduct");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "delete a list of Products", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Products deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @DeleteMapping(value = "/products")
    @ResponseBody
    public ResponseEntity<String> deleteProducts(
            @Valid @RequestParam(value = "ids", required = true) List<Integer> idsProduct,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Product Service[delete] : deleteProducts");

        return ResponseEntity.ok()
                .body("");
    }

    @Operation(summary = "Get list Product by Store", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping(value = "/products/{id}")
    @ResponseBody
    public ResponseEntity<List<Product>> getProductListByStore(@PathVariable int id,
                                                                    @RequestHeader HttpHeaders headers, BearerTokenAuthentication authentication) {
        log.debug("Product Service[get] : getProductListByStore");

        return ResponseEntity.ok().body(List.of(new Product()));
    }

    @Operation(summary = "Get Product by ID", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @GetMapping(value = "/{id}")
    @ResponseBody
    public ResponseEntity<Product> getById(@PathVariable int id, @RequestHeader HttpHeaders headers,
                                           BearerTokenAuthentication authentication) {
        log.debug("Product Service[get] : getById");

        return ResponseEntity.ok().body(new Product());
    }

    @Operation(summary = "Clone a Product", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product cloned"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/clone/{id}")
    @ResponseBody
    public ResponseEntity<String> cloneProduct(@PathVariable int id,
                                               @RequestHeader HttpHeaders headers, BearerTokenAuthentication authentication) {
        log.debug("Product Service[Post] : cloneProduct");

        return ResponseEntity.ok().body("");
    }

    @Operation(summary = "Get Product list using filters", tags = {"Manage Product"}, responses = {
            @ApiResponse(responseCode = "200", description = "Product list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")})
    @PostMapping(value = "/filters")
    @ResponseBody
    public ResponseEntity<List<Product>> getByFilters(
            @RequestBody List<FilterProductDto> filterProductDtos,
            @RequestParam(required = false, defaultValue = "20", name = "size") String size,
            @RequestParam(required = false, defaultValue = "0", name = "page") String page,
            @RequestParam(required = false, defaultValue = "id,desc", name = "sort") String sort,
            @RequestHeader HttpHeaders headers,
            BearerTokenAuthentication authentication) {
        log.debug("Product Service[post] : get by filters");

        return ResponseEntity.ok()
                .body(List.of(new Product()));
    }
}
