package fr.yelha.model.enums;

/**
 * Énumération des différentes catégories de produits disponibles sur la plateforme.
 */
public enum ProductCategory {
    PAIN("Pain"),
    VIENNOISERIE("Viennoiserie"),
    PATISSERIE("Pâtisserie"),
    SANDWICH("Sandwich"),
    PLAT("Plat"),
    BOISSON("Boisson"),
    FRUIT("Fruit"),
    LEGUME("Légume"),
    EPICERIE("Épicerie"),
    AUTRE("Autre");

    private final String displayName;

    ProductCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 