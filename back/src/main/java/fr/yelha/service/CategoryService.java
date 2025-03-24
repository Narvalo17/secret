package fr.yelha.service;

import fr.yelha.dto.CategoryDto;
import fr.yelha.model.Category;
import fr.yelha.model.enums.CategoryType;
import fr.yelha.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        updateCategoryFromDto(category, categoryDto);
        
        if (categoryDto.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Catégorie parente non trouvée avec l'ID : " + categoryDto.getParentId()));
            category.setParent(parent);
        }
        
        return convertToDto(categoryRepository.save(category));
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = getCategoryOrThrow(id);
        updateCategoryFromDto(category, categoryDto);
        
        if (categoryDto.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Catégorie parente non trouvée avec l'ID : " + categoryDto.getParentId()));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
        
        return convertToDto(categoryRepository.save(category));
    }

    public CategoryDto getCategoryById(Long id) {
        return convertToDto(getCategoryOrThrow(id));
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<CategoryDto> getCategoriesByType(CategoryType type, Pageable pageable) {
        return categoryRepository.findByType(type, pageable)
                .map(this::convertToDto);
    }

    public List<CategoryDto> getSubCategories(Long parentId) {
        return categoryRepository.findByParentId(parentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryOrThrow(id);
        if (!category.getChildren().isEmpty()) {
            throw new RuntimeException("Impossible de supprimer une catégorie qui contient des sous-catégories");
        }
        categoryRepository.delete(category);
    }

    private Category getCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID : " + id));
    }

    private void updateCategoryFromDto(Category category, CategoryDto dto) {
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setSlug(dto.getSlug());
        category.setImageUrl(dto.getImageUrl());
        category.setActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        category.setType(dto.getType());
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setSlug(category.getSlug());
        dto.setImageUrl(category.getImageUrl());
        dto.setIsActive(category.isActive());
        dto.setType(category.getType());
        
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
            dto.setParentName(category.getParent().getName());
        }
        
        dto.setLevel(category.getLevel());
        dto.setPath(category.getPath());
        dto.setTotalProducts(category.getTotalProducts());
        dto.setTotalStores(category.getTotalStores());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        
        return dto;
    }
} 