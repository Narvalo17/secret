package fr.yelha.controller;

import fr.yelha.dto.StoreHoursDto;
import fr.yelha.service.StoreHoursService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/store-hours")
@RequiredArgsConstructor
public class StoreHoursController {
    private final StoreHoursService storeHoursService;

    @PostMapping("/store/{storeId}")
    @PreAuthorize("hasRole('ADMIN') or @storeHoursService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<StoreHoursDto> createStoreHours(
            @PathVariable Long storeId,
            @RequestBody StoreHoursDto storeHoursDto) {
        return ResponseEntity.ok(storeHoursService.createStoreHours(storeHoursDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @storeHoursService.isStoreHoursOwner(#id, authentication.principal.id)")
    public ResponseEntity<StoreHoursDto> updateStoreHours(
            @PathVariable Long id,
            @RequestBody StoreHoursDto storeHoursDto) {
        return ResponseEntity.ok(storeHoursService.updateStoreHours(id, storeHoursDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreHoursDto> getStoreHours(@PathVariable Long id) {
        return ResponseEntity.ok(storeHoursService.getStoreHoursById(id));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<StoreHoursDto>> getStoreHoursByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(storeHoursService.getStoreHoursByStore(storeId));
    }

    @GetMapping("/store/{storeId}/day/{dayOfWeek}")
    public ResponseEntity<StoreHoursDto> getStoreHoursByDay(
            @PathVariable Long storeId,
            @PathVariable DayOfWeek dayOfWeek) {
        return ResponseEntity.ok(storeHoursService.getStoreHoursByDay(storeId, dayOfWeek));
    }

    @PutMapping("/store/{storeId}/day/{dayOfWeek}/special")
    @PreAuthorize("hasRole('ADMIN') or @storeHoursService.isStoreOwner(#storeId, authentication.principal.id)")
    public ResponseEntity<StoreHoursDto> updateSpecialHours(
            @PathVariable Long storeId,
            @PathVariable DayOfWeek dayOfWeek,
            @RequestParam LocalTime openTime,
            @RequestParam LocalTime closeTime,
            @RequestParam(required = false) String note) {
        storeHoursService.updateSpecialHours(storeId, dayOfWeek, openTime, closeTime, note);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @storeHoursService.isStoreHoursOwner(#id, authentication.principal.id)")
    public ResponseEntity<Void> deleteStoreHours(@PathVariable Long id) {
        storeHoursService.deleteStoreHours(id);
        return ResponseEntity.noContent().build();
    }
} 