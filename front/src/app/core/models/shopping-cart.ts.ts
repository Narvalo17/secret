export interface ShoppingCartItem {
    id?: number;
    cartId?: number;
    productId: number;
    productName?: string;
    productImage?: string;
    productPrice?: number;
    quantity: number;
    totalPrice?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShoppingCart {
    id?: number;
    userId?: number;
    items: ShoppingCartItem[];
    totalAmount?: number;
    totalItems?: number;
    createdAt?: string;
    updatedAt?: string;
}
