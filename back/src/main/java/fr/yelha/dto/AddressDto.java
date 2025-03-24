package fr.yelha.dto;

import fr.yelha.model.enums.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AddressDto {
    private Long id;
    private Long userId;

    @NotBlank(message = "La rue est obligatoire")
    private String street;

    @NotBlank(message = "La ville est obligatoire")
    private String city;

    private String state;

    @NotBlank(message = "Le pays est obligatoire")
    private String country;

    @NotBlank(message = "Le code postal est obligatoire")
    private String zipCode;

    private String phone;

    private String additionalInfo;

    private Boolean isDefault = false;

    @NotNull(message = "Le type d'adresse est obligatoire")
    private AddressType type;

    private String label;

    private Double latitude;
    private Double longitude;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (street != null) sb.append(street).append(", ");
        if (city != null) sb.append(city).append(", ");
        if (state != null) sb.append(state).append(", ");
        if (country != null) sb.append(country).append(" ");
        if (zipCode != null) sb.append(zipCode);
        return sb.toString().trim();
    }
} 