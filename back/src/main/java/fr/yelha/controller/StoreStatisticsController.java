package fr.yelha.controller;

import fr.yelha.dto.StoreStatisticsDto;
import fr.yelha.service.StoreStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store-statistics")
@RequiredArgsConstructor
public class StoreStatisticsController {
    private final StoreStatisticsService storeStatisticsService;

    @PostMapping("/store/{storeId}")
    @PreAuthorize("hasRole('ADMIN') or @storeStatisticsService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<StoreStatisticsDto> createStoreStatistics(@PathVariable Long storeId) {
        return ResponseEntity.ok(storeStatisticsService.createStoreStatistics(storeId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @storeStatisticsService.isStoreStatisticsOwner(#id, authentication.principal.id)")
    public ResponseEntity<StoreStatisticsDto> updateStoreStatistics(
            @PathVariable Long id,
            @RequestBody StoreStatisticsDto statisticsDto) {
        return ResponseEntity.ok(storeStatisticsService.updateStoreStatistics(id, statisticsDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @storeStatisticsService.isStoreStatisticsOwner(#id, authentication.principal.id)")
    public ResponseEntity<StoreStatisticsDto> getStoreStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(storeStatisticsService.getStoreStatisticsById(id));
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasRole('ADMIN') or @storeStatisticsService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<StoreStatisticsDto> getStoreStatisticsByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(storeStatisticsService.getStoreStatisticsByStore(storeId));
    }

    @PostMapping("/store/{storeId}/increment-view")
    @PreAuthorize("hasRole('ADMIN') or @storeStatisticsService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long storeId) {
        storeStatisticsService.incrementViewCount(storeId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/store/{storeId}/update-order")
    @PreAuthorize("hasRole('ADMIN') or @storeStatisticsService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<Void> updateOrderStatistics(
            @PathVariable Long storeId,
            @RequestParam Double orderAmount) {
        storeStatisticsService.updateOrderStatistics(storeId, orderAmount);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resetDailyStatistics() {
        storeStatisticsService.resetDailyStatistics();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resetMonthlyStatistics() {
        storeStatisticsService.resetMonthlyStatistics();
        return ResponseEntity.ok().build();
    }
} 