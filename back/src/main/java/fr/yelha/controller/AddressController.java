package fr.yelha.controller;

import fr.yelha.dto.AddressDto;
import fr.yelha.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    public ResponseEntity<AddressDto> createAddress(@PathVariable Long userId, @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.createAddress(addressDto, userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') and @addressService.isAddressOwner(#id, authentication.principal.id)")
    public ResponseEntity<AddressDto> updateAddress(@PathVariable Long id, @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.updateAddress(id, addressDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') and @addressService.isAddressOwner(#id, authentication.principal.id)")
    public ResponseEntity<AddressDto> getAddress(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    public ResponseEntity<List<AddressDto>> getAddressesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUser(userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') and @addressService.isAddressOwner(#id, authentication.principal.id)")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/default")
    @PreAuthorize("hasRole('USER') and @addressService.isAddressOwner(#id, authentication.principal.id)")
    public ResponseEntity<AddressDto> setDefaultAddress(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(addressService.setDefaultAddress(Long.parseLong(authentication.getName()), id));
    }
} 