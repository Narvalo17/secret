package fr.yelha.repository;

import fr.yelha.model.Category;
import fr.yelha.model.enums.CategoryType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    List<Category> findByParentId(Long parentId);
    List<Category> findByType(CategoryType type);
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL")
    List<Category> findRootCategories();
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL AND c.type = :type")
    List<Category> findRootCategoriesByType(CategoryType type);
    
    Page<Category> findByParentId(Long parentId, Pageable pageable);
    Page<Category> findByType(CategoryType type, Pageable pageable);
    
    @Query("SELECT c FROM Category c WHERE c.path LIKE CONCAT(:parentPath, '%')")
    List<Category> findDescendants(String parentPath);
    
    @Query("SELECT COUNT(c) FROM Category c WHERE c.parent = :parent")
    Long countChildren(Category parent);
} 