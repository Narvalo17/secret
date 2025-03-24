package fr.yelha.repository;

import fr.yelha.model.Favorite;
import fr.yelha.model.Product;
import fr.yelha.model.Store;
import fr.yelha.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Page<Favorite> findByUser(User user, Pageable pageable);
    Optional<Favorite> findByUserAndStore(User user, Store store);
    Optional<Favorite> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndStore(User user, Store store);
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserAndStore(User user, Store store);
    void deleteByUserAndProduct(User user, Product product);
} 