package fr.yelha.repository;

import fr.yelha.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByStoreId(Long storeId, Pageable pageable);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
    Page<Product> findByStoreIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(Long storeId, String name, String description, Pageable pageable);
    boolean existsByIdAndStoreOwnerId(Long productId, Long ownerId);

    @Query("SELECT p FROM Product p WHERE p.active = true")
    Page<Product> findByActiveTrue(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND p.active = true")
    Page<Product> findByStoreIdAndActiveTrue(Long storeId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> search(String query, Pageable pageable);
} 