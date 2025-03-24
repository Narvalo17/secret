package fr.yelha.service;

import fr.yelha.dto.AddressDto;
import fr.yelha.model.Address;
import fr.yelha.model.User;
import fr.yelha.repository.AddressRepository;
import fr.yelha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressDto createAddress(AddressDto addressDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Address address = new Address();
        updateAddressFromDto(address, addressDto);
        address.setUser(user);
        
        if (addressDto.getIsDefault() != null && addressDto.getIsDefault()) {
            setDefaultAddress(user, address);
        }
        
        return convertToDto(addressRepository.save(address));
    }

    public AddressDto updateAddress(Long id, AddressDto addressDto) {
        Address address = getAddressOrThrow(id);
        updateAddressFromDto(address, addressDto);
        
        if (addressDto.getIsDefault() != null && addressDto.getIsDefault()) {
            setDefaultAddress(address.getUser(), address);
        }
        
        return convertToDto(addressRepository.save(address));
    }

    public AddressDto getAddressById(Long id) {
        return convertToDto(getAddressOrThrow(id));
    }

    public List<AddressDto> getAddressesByUser(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AddressDto setDefaultAddress(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Address address = getAddressOrThrow(addressId);
        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Cette adresse n'appartient pas à l'utilisateur");
        }
        
        setDefaultAddress(user, address);
        return convertToDto(addressRepository.save(address));
    }

    public void deleteAddress(Long id) {
        Address address = getAddressOrThrow(id);
        if (address.isDefault()) {
            throw new RuntimeException("Impossible de supprimer l'adresse par défaut");
        }
        addressRepository.delete(address);
    }

    public boolean isAddressOwner(Long addressId, Long userId) {
        return addressRepository.existsByIdAndUserId(addressId, userId);
    }

    private Address getAddressOrThrow(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adresse non trouvée avec l'ID : " + id));
    }

    private void setDefaultAddress(User user, Address newDefaultAddress) {
        addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(address -> {
                    address.setDefault(false);
                    addressRepository.save(address);
                });
        newDefaultAddress.setDefault(true);
    }

    private void updateAddressFromDto(Address address, AddressDto dto) {
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setCountry(dto.getCountry());
        address.setZipCode(dto.getZipCode());
        address.setPhone(dto.getPhone());
        address.setAdditionalInfo(dto.getAdditionalInfo());
        address.setDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
        address.setType(dto.getType());
        address.setLabel(dto.getLabel());
        address.setLatitude(dto.getLatitude());
        address.setLongitude(dto.getLongitude());
    }

    private AddressDto convertToDto(Address address) {
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setUserId(address.getUser().getId());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setCountry(address.getCountry());
        dto.setZipCode(address.getZipCode());
        dto.setPhone(address.getPhone());
        dto.setAdditionalInfo(address.getAdditionalInfo());
        dto.setIsDefault(address.isDefault());
        dto.setType(address.getType());
        dto.setLabel(address.getLabel());
        dto.setLatitude(address.getLatitude());
        dto.setLongitude(address.getLongitude());
        dto.setCreatedAt(address.getCreatedAt());
        dto.setUpdatedAt(address.getUpdatedAt());
        return dto;
    }
} 