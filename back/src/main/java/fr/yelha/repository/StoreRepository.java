package fr.yelha.repository;

import fr.yelha.model.Store;
import fr.yelha.model.enums.StoreType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findBySlug(String slug);
    Optional<Store> findByOwnerId(Long ownerId);
    
    List<Store> findByIsActiveTrue();
    Page<Store> findByIsActiveTrue(Pageable pageable);
    
    @Query("SELECT s FROM Store s WHERE s.isActive = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Store> searchStores(String query, Pageable pageable);

    Page<Store> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
    boolean existsByIdAndOwnerId(Long storeId, Long ownerId);

    Page<Store> findByStoreType(StoreType storeType, Pageable pageable);
} 