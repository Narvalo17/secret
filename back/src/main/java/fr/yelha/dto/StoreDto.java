package fr.yelha.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class StoreDto {
    private Long id;

    @NotBlank(message = "Le nom du magasin est obligatoire")
    private String name;

    private String description;
    private String imageUrl;

    @NotNull(message = "Le propriétaire est obligatoire")
    private Long ownerId;

    private Long categoryId;

    @NotBlank(message = "L'adresse est obligatoire")
    private String address;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String phone;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email n'est pas valide")
    private String email;

    private String website;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String category;
    private String categoryName;
    private String ownerName;
    private List<ProductDto> products;
    private Double rating;
    private Integer ratingCount;
    private List<StoreHoursDto> openingHours;
} 