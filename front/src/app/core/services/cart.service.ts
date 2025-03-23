import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = {
    items: [],
    total: 0
  };

  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Charger le panier depuis le localStorage au démarrage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  private calculateTotal(): void {
    this.cart.total = this.cart.items.reduce((total, item) => {
      return total + (item.product.currentPrice * item.quantity);
    }, 0);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      // Vérifier si la quantité demandée est disponible
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= product.quantity) {
        existingItem.quantity = newQuantity;
      } else {
        throw new Error('Quantité non disponible');
      }
    } else {
      if (quantity <= product.quantity) {
        this.cart.items.push({ product, quantity });
      } else {
        throw new Error('Quantité non disponible');
      }
    }

    this.calculateTotal();
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
    this.calculateTotal();
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cart.items.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= item.product.quantity) {
        item.quantity = quantity;
        this.calculateTotal();
        this.saveCart();
      } else {
        throw new Error('Quantité non disponible');
      }
    }
  }

  clearCart(): void {
    this.cart = {
      items: [],
      total: 0
    };
    this.saveCart();
  }

  getCart(): Cart {
    return this.cart;
  }

  getCartItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }
} 