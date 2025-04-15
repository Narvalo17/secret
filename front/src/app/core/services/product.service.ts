import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, from } from 'rxjs';
import { Product, ProductResponse, ProductFilter } from '../models/product.model';
import { environment } from '../../../environments/environment';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { CartService } from './cart.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  getAllProducts(page: number = 0, size: number = 10): Observable<{ content: Product[], totalElements: number }> {
    console.log(`Appel API pour récupérer tous les produits, page ${page}, taille ${size}`);
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API getAllProducts:', response);
          
          // Vérifier si la réponse est au format attendu
          if (!response || typeof response !== 'object') {
            console.error('Format de réponse invalide:', response);
            return { content: [], totalElements: 0 };
          }
          
          // Normaliser la réponse
          const content = Array.isArray(response.content) ? response.content : 
                         (Array.isArray(response) ? response : []);
          const totalElements = response.totalElements || content.length || 0;
          
          // Vérifier et logger chaque produit
          content.forEach((product: any) => {
            console.log('Produit reçu:', {
              id: product?.id,
              name: product?.name,
              storeId: product?.storeId,
              price: product?.price
            });
          });
          
          return { 
            content: content as Product[], 
            totalElements 
          };
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des produits:', error);
          return of({ content: [], totalElements: 0 });
        })
      );
  }

  getProductsByStore(storeId: number, page: number = 0, size: number = 10): Observable<{ content: Product[], totalElements: number }> {
    console.log(`Appel API pour récupérer les produits du magasin ${storeId}, page ${page}, taille ${size}`);
    return this.http.get<any>(`${this.apiUrl}/store/${storeId}?page=${page}&size=${size}`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API getProductsByStore:', response);
          
          // Vérifier si la réponse est au format attendu
          if (!response || typeof response !== 'object') {
            console.error('Format de réponse invalide:', response);
            return { content: [], totalElements: 0 };
          }
          
          // Normaliser la réponse même si le format est légèrement différent
          const content = Array.isArray(response.content) ? response.content : 
                         (Array.isArray(response) ? response : []);
          const totalElements = response.totalElements || content.length || 0;
          
          return { 
            content, 
            totalElements 
          };
        })
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number, page: number = 0, size: number = 10): Observable<{ content: Product[], totalElements: number }> {
    return this.http.get<any>(`${this.apiUrl}/category/${categoryId}?page=${page}&size=${size}`);
  }

  searchProducts(query: string, page: number = 0, size: number = 10): Observable<{ content: Product[], totalElements: number }> {
    return this.http.get<any>(`${this.apiUrl}/search?query=${query}&page=${page}&size=${size}`);
  }

  searchProductsByStore(storeId: number, query: string, page: number = 0, size: number = 10): Observable<{ content: Product[], totalElements: number }> {
    return this.http.get<any>(`${this.apiUrl}/store/${storeId}/search?query=${query}&page=${page}&size=${size}`);
  }

  createProduct(product: any): Observable<Product> {
    console.log('ProductService: Création du produit', JSON.stringify(product));
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProductStatus(id: number, isActive: boolean): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/status?isActive=${isActive}`, {});
  }

  // Méthodes utilitaires
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  }

  getProductImageUrl(product: Product): string {
    return product.imageUrl || 'assets/images/product-placeholder.jpg';
  }

  // Méthode pour ajouter un produit au panier
  addToCart(productId: number, quantity: number = 1): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || typeof currentUser !== 'object' || !('id' in currentUser)) {
      console.error('User not authenticated');
      return throwError(() => new Error('Please log in to add items to cart'));
    }

    return this.getProductById(productId).pipe(
      switchMap(product => {
        if (!product) {
          console.error('Product not found');
          return throwError(() => new Error('Product not found'));
        }

        if (product.quantity < quantity) {
          console.error('Insufficient quantity available');
          return throwError(() => new Error('Insufficient quantity available'));
        }

        console.log('Adding to cart:', { productId, quantity });
        return this.cartService.addToCart({ productId, quantity }).pipe(
          map(() => void 0),
          tap(() => console.log('Successfully added to cart'))
        );
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        return throwError(() => error);
      })
    );
  }
} 