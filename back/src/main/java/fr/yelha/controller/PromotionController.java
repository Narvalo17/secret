package fr.yelha.controller;

import fr.yelha.dto.PromotionDto;
import fr.yelha.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @PostMapping("/store/{storeId}")
    @PreAuthorize("hasRole('ADMIN') or @promotionService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<PromotionDto> createPromotion(
            @PathVariable Long storeId,
            @RequestBody PromotionDto promotionDto) {
        return ResponseEntity.ok(promotionService.createPromotion(promotionDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @promotionService.isPromotionOwner(#id, authentication.principal.id)")
    public ResponseEntity<PromotionDto> updatePromotion(
            @PathVariable Long id,
            @RequestBody PromotionDto promotionDto) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, promotionDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionDto> getPromotion(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    @GetMapping
    public ResponseEntity<Page<PromotionDto>> getAllPromotions(Pageable pageable) {
        return ResponseEntity.ok(promotionService.getAllPromotions(pageable));
    }

    @GetMapping("/active")
    public ResponseEntity<Page<PromotionDto>> getActivePromotions(Pageable pageable) {
        return ResponseEntity.ok(promotionService.getActivePromotions(pageable));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<Page<PromotionDto>> getPromotionsByStore(
            @PathVariable Long storeId,
            Pageable pageable) {
        return ResponseEntity.ok(promotionService.getPromotionsByStore(storeId, pageable));
    }

    @GetMapping("/store/{storeId}/active")
    public ResponseEntity<Page<PromotionDto>> getActivePromotionsByStore(
            @PathVariable Long storeId,
            Pageable pageable) {
        return ResponseEntity.ok(promotionService.getActivePromotionsByStore(storeId, pageable));
    }

    @PostMapping("/validate")
    public ResponseEntity<PromotionDto> validatePromotion(
            @RequestParam String code,
            @RequestParam Long storeId) {
        return ResponseEntity.ok(promotionService.validatePromotion(code, storeId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @promotionService.isPromotionOwner(#id, authentication.principal.id)")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
} 