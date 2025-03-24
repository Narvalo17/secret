package fr.yelha.controller;

import fr.yelha.dto.StoreDto;
import fr.yelha.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STORE_OWNER')")
    public ResponseEntity<StoreDto> createStore(@RequestBody StoreDto storeDto, Authentication authentication) {
        return ResponseEntity.ok(storeService.createStore(storeDto, Long.parseLong(authentication.getName())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @storeService.isStoreOwner(#id, authentication.principal.id)")
    public ResponseEntity<StoreDto> updateStore(@PathVariable Long id, @RequestBody StoreDto storeDto) {
        return ResponseEntity.ok(storeService.updateStore(id, storeDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStore(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping
    public ResponseEntity<Page<StoreDto>> getAllStores(Pageable pageable) {
        return ResponseEntity.ok(storeService.getAllStores(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<StoreDto>> searchStores(@RequestParam String query, Pageable pageable) {
        return ResponseEntity.ok(storeService.searchStores(query, pageable));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<StoreDto>> getStoresByCategory(@PathVariable Long categoryId, Pageable pageable) {
        return ResponseEntity.ok(storeService.getStoresByCategory(categoryId.toString(), pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @storeService.isStoreOwner(#id, authentication.principal.id)")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreDto> updateStoreStatus(@PathVariable Long id, @RequestParam boolean isActive) {
        return ResponseEntity.ok(storeService.updateStoreStatus(id, isActive));
    }
}
