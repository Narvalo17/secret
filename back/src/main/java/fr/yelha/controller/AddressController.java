package fr.yelha.controller;

import fr.yelha.dto.AddressDto;
import fr.yelha.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressDto> createAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.createAddress(addressDto, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.updateAddress(id, addressDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDto> getAddress(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDto>> getAddressesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<AddressDto> setDefaultAddress(
            @PathVariable Long id,
            @PathVariable Long userId) {
        return ResponseEntity.ok(addressService.setDefaultAddress(userId, id));
    }
} 