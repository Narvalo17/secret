package fr.yelha.service;

import fr.yelha.dto.StoreDto;
import fr.yelha.model.Store;
import fr.yelha.model.User;
import fr.yelha.model.Category;
import fr.yelha.repository.StoreRepository;
import fr.yelha.repository.UserRepository;
import fr.yelha.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreService {
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public StoreDto createStore(StoreDto storeDto, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        Store store = new Store();
        updateStoreFromDto(store, storeDto);
        store.setOwner(owner);

        if (storeDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(storeDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Catégorie non trouvée"));
            store.setCategory(category);
        }

        return convertToDto(storeRepository.save(store));
    }

    public StoreDto updateStore(Long id, StoreDto storeDto) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Magasin non trouvé"));

        updateStoreFromDto(store, storeDto);

        if (storeDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(storeDto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Catégorie non trouvée"));
            store.setCategory(category);
        }

        return convertToDto(storeRepository.save(store));
    }

    public StoreDto getStoreById(Long id) {
        return storeRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Magasin non trouvé"));
    }

    public Page<StoreDto> getAllStores(Pageable pageable) {
        return storeRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public Page<StoreDto> searchStores(String query, Pageable pageable) {
        return storeRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable)
                .map(this::convertToDto);
    }

    public Page<StoreDto> getStoresByCategory(String categoryId, Pageable pageable) {
        return storeRepository.findByCategoryId(Long.parseLong(categoryId), pageable)
                .map(this::convertToDto);
    }

    public void deleteStore(Long id) {
        if (!storeRepository.existsById(id)) {
            throw new EntityNotFoundException("Magasin non trouvé");
        }
        storeRepository.deleteById(id);
    }

    public StoreDto updateStoreStatus(Long id, boolean isActive) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Magasin non trouvé"));
        
        store.setActive(isActive);
        return convertToDto(storeRepository.save(store));
    }

    public boolean isStoreOwner(Long storeId, Long userId) {
        return storeRepository.existsByIdAndOwnerId(storeId, userId);
    }

    private void updateStoreFromDto(Store store, StoreDto dto) {
        store.setName(dto.getName());
        store.setDescription(dto.getDescription());
        store.setImageUrl(dto.getImageUrl());
        store.setAddress(dto.getAddress());
        store.setPhone(dto.getPhone());
        store.setEmail(dto.getEmail());
        store.setWebsite(dto.getWebsite());
        store.setActive(dto.isActive());
    }

    private StoreDto convertToDto(Store store) {
        StoreDto dto = new StoreDto();
        dto.setId(store.getId());
        dto.setName(store.getName());
        dto.setDescription(store.getDescription());
        dto.setImageUrl(store.getImageUrl());
        dto.setOwnerId(store.getOwner().getId());
        if (store.getCategory() != null) {
            dto.setCategoryId(store.getCategory().getId());
        }
        dto.setAddress(store.getAddress());
        dto.setPhone(store.getPhone());
        dto.setEmail(store.getEmail());
        dto.setWebsite(store.getWebsite());
        dto.setActive(store.isActive());
        dto.setCreatedAt(store.getCreatedAt());
        dto.setUpdatedAt(store.getUpdatedAt());
        return dto;
    }
} 