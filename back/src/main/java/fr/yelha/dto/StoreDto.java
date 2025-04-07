package fr.yelha.dto;

import fr.yelha.model.enums.StoreType;
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
    private String slug;

    @NotNull(message = "Le propriétaire est obligatoire")
    private Long ownerId;

    @NotNull(message = "Le type de magasin est obligatoire")
    private StoreType storeType;

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

    private String storeTypeName;
    private String ownerName;
    private List<ProductDto> products;
    private Double rating;
    private Integer ratingCount;

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
    
    @NotBlank(message = "La confirmation du mot de passe est obligatoire")
    private String confirmPassword;
} 