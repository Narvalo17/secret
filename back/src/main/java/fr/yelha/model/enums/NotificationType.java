package fr.yelha.model.enums;

public enum NotificationType {
    INFO("Information", "info"),
    SUCCESS("Succès", "success"),
    WARNING("Avertissement", "warning"),
    ERROR("Erreur", "error"),
    ORDER("Commande", "shopping_cart"),
    PAYMENT("Paiement", "payment"),
    SHIPPING("Livraison", "local_shipping"),
    PRODUCT("Produit", "inventory"),
    STORE("Magasin", "store"),
    SYSTEM("Système", "settings"),
    SECURITY("Sécurité", "security");

    private final String label;
    private final String icon;

    NotificationType(String label, String icon) {
        this.label = label;
        this.icon = icon;
    }

    public String getLabel() {
        return label;
    }

    public String getIcon() {
        return icon;
    }
} 