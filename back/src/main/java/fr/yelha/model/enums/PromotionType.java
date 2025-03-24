package fr.yelha.model.enums;

public enum PromotionType {
    PERCENTAGE("Pourcentage", "%"),
    FIXED_AMOUNT("Montant fixe", "€");

    private final String label;
    private final String symbol;

    PromotionType(String label, String symbol) {
        this.label = label;
        this.symbol = symbol;
    }

    public String getLabel() {
        return label;
    }

    public String getSymbol() {
        return symbol;
    }

    public String format(Double value) {
        if (this == PERCENTAGE) {
            return value + symbol;
        } else {
            return value + " " + symbol;
        }
    }
} 