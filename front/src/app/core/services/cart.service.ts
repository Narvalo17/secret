import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CartItem, Cart } from '../models/cart.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { tap, catchError } from 'rxjs/operators';

interface AddToCartRequest {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/carts`;
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0
  });

  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('🛒 [CartService] Initialisation avec URL:', this.apiUrl);
    this.loadCart();
  }

  private getCurrentUserId(): number {
    const currentUser = this.authService.getCurrentUser();
    console.log('👤 [CartService] Vérification de l\'utilisateur:', currentUser);
    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }
    return currentUser.id;
  }

  private loadCart(): void {
    try {
      const userId = this.getCurrentUserId();
      console.log('🔄 [CartService] Chargement du panier pour l\'utilisateur:', userId);
      this.http.get<Cart>(`${this.apiUrl}/user/${userId}`).subscribe({
        next: (cart) => {
          console.log('✅ [CartService] Panier chargé:', cart);
          this.cartSubject.next(cart);
        },
        error: (error) => {
          console.error('❌ [CartService] Erreur lors du chargement du panier:', error);
        }
      });
    } catch (error) {
      console.error('❌ [CartService] Erreur lors du chargement du panier:', error);
    }
  }

  addToCart(item: { productId: number; quantity: number }): Observable<Cart> {
    try {
      const userId = this.getCurrentUserId();
      console.log('🛒 [CartService] Tentative d\'ajout au panier:', { 
        userId,
        productId: item.productId,
        quantity: item.quantity,
        apiUrl: this.apiUrl
      });
      
      const url = `${this.apiUrl}/user/${userId}/items?productId=${item.productId}&quantity=${item.quantity}`;
      console.log('📡 [CartService] URL de la requête:', url);
      
      return this.http.post<Cart>(url, null).pipe(
        tap(cart => {
          console.log('✅ [CartService] Réponse du serveur:', cart);
          this.cartSubject.next(cart);
        }),
        catchError(error => {
          console.error('❌ [CartService] Erreur lors de l\'ajout au panier:', error);
          console.error('Détails de l\'erreur:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message
          });
          
          if (error.status === 401) {
            throw new Error('Veuillez vous connecter pour ajouter des produits au panier');
          } else if (error.error?.message) {
            throw new Error(error.error.message);
          } else {
            throw new Error('Erreur lors de l\'ajout au panier');
          }
        })
      );
    } catch (error) {
      console.error('❌ [CartService] Erreur:', error);
      return throwError(() => error);
    }
  }

  getCart(): Observable<Cart> {
    try {
      const userId = this.getCurrentUserId();
      return this.http.get<Cart>(`${this.apiUrl}/user/${userId}`).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  removeFromCart(productId: number): Observable<Cart> {
    try {
      const userId = this.getCurrentUserId();
      return this.http.delete<Cart>(`${this.apiUrl}/user/${userId}/items/${productId}`).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateCartItem(productId: number, quantity: number): Observable<Cart> {
    try {
      const userId = this.getCurrentUserId();
      return this.http.put<Cart>(
        `${this.apiUrl}/user/${userId}/items/${productId}?quantity=${quantity}`,
        null
      ).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  clearCart(): Observable<void> {
    try {
      const userId = this.getCurrentUserId();
      return this.http.delete<void>(`${this.apiUrl}/user/${userId}`).pipe(
        tap(() => this.cartSubject.next({ items: [], total: 0 }))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getCartItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0);
  }
} 