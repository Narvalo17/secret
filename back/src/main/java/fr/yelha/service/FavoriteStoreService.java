package fr.yelha.service;

import fr.yelha.dto.FilterFavoriteDto;
import fr.yelha.model.FavoriteStore;
import fr.yelha.model.Store;
import fr.yelha.model.User;
import fr.yelha.repository.FavoriteStoreRepository;
import fr.yelha.repository.StoreRepository;
import fr.yelha.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteStoreService {
    private final FavoriteStoreRepository favoriteStoreRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    public FavoriteStore saveFavoriteStore(Long storeId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Magasin non trouvé avec l'ID : " + storeId));

        FavoriteStore favoriteStore = new FavoriteStore();
        favoriteStore.setUser(user);
        favoriteStore.setStore(store);
        
        return favoriteStoreRepository.save(favoriteStore);
    }

    public void deleteFavoriteStore(Long storeId, Long userId) {
        favoriteStoreRepository.deleteByStoreIdAndUserId(storeId, userId);
    }

    public List<FavoriteStore> getFavoriteStoresByUser(Long userId) {
        return favoriteStoreRepository.findByUserId(userId);
    }

    public List<FavoriteStore> getFavoriteStoresByFilters(
            List<FilterFavoriteDto> filters,
            int size,
            int page,
            String sort,
            Long userId) {
        // TODO: Implémenter la logique de filtrage
        return favoriteStoreRepository.findByUserId(userId);
    }
} 