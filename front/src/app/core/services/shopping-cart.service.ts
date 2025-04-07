import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '@env/environment';

interface CartItem extends Product {
  selectedQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private readonly apiUrl = `${environment.apiUrl}/shopping-cart`;

  constructor(private http: HttpClient) { }

  getShoppingCart(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number = 1): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, { productId, quantity });
  }

  removeFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

  updateQuantity(productId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${productId}`, { quantity });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  // Méthode utilitaire pour calculer le total du panier
  calculateTotal(items: Product[]): number {
    return items.reduce((sum, item) => {
      const quantity = (item as any).selectedQuantity || item.quantity || 1;
      return sum + (item.price * quantity);
    }, 0);
  }
} 