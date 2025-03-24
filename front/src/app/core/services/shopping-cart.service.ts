import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private readonly apiUrl = 'api/shopping';

  constructor(private http: HttpClient) { }

  getShoppingCart(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addToCart(productId: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { productId });
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
} 