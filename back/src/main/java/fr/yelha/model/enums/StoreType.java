package fr.yelha.model.enums;

/**
 * Énumération des différents types de magasins disponibles sur la plateforme.
 */
public enum StoreType {
    BOULANGERIE("Boulangerie"),
    RESTAURANT("Restaurant"),
    SUPERMARCHE("Supermarché"),
    EPICERIE("Épicerie"),
    PRIMEUR("Primeur"),
    PATISSERIE("Pâtisserie"),
    TRAITEUR("Traiteur"),
    AUTRE("Autre");

    private final String displayName;

    StoreType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 