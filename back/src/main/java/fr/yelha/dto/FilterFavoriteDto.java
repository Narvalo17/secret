package fr.yelha.dto;

import lombok.Data;

@Data
public class FilterFavoriteDto {
    private String field;
    private String operator;
    private String value;
} 