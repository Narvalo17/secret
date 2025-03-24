import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Cart } from '../models/cart.model';
import { Product } from '@core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0
  });

  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Charger le panier depuis le localStorage au démarrage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  addToCart(item: CartItem): Observable<void> {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(i => i.id === item.id);

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité si l'article existe déjà
      currentCart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Ajouter le nouvel article
      currentCart.items.push(item);
    }

    // Recalculer le total
    currentCart.total = this.calculateTotal(currentCart.items);

    // Mettre à jour le panier
    this.cartSubject.next(currentCart);
    this.saveCart(currentCart);

    return new Observable<void>(subscriber => {
      subscriber.next();
      subscriber.complete();
    });
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private saveCart(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  removeFromCart(itemId: string): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    currentCart.total = this.calculateTotal(currentCart.items);
    this.cartSubject.next(currentCart);
    this.saveCart(currentCart);
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      currentCart.total = this.calculateTotal(currentCart.items);
      this.cartSubject.next(currentCart);
      this.saveCart(currentCart);
    }
  }

  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      total: 0
    };
    this.cartSubject.next(emptyCart);
    this.saveCart(emptyCart);
  }

  getCartItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0);
  }
} 