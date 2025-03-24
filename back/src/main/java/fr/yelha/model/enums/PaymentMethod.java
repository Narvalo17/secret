package fr.yelha.model.enums;

public enum PaymentMethod {
    CARD("Carte bancaire"),
    PAYPAL("PayPal"),
    BANK_TRANSFER("Virement bancaire"),
    CASH("Espèces"),
    CHECK("Chèque"),
    APPLE_PAY("Apple Pay"),
    GOOGLE_PAY("Google Pay");

    private final String label;

    PaymentMethod(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
} 