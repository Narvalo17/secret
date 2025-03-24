package fr.yelha.model.enums;

public enum AddressType {
    SHIPPING("Livraison"),
    BILLING("Facturation"),
    HOME("Domicile"),
    WORK("Travail"),
    OTHER("Autre");

    private final String label;

    AddressType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
} 