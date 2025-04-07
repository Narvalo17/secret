import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product, ProductResponse, ProductFilter } from '../models/product.model';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {}

  getAllProducts(page: number = 0, size: number = 10): Observable<{ content: Product[], totalElements: number }> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
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
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    // Vérifier si l'utilisateur est connecté
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      this.notificationService.warning('Veuillez vous connecter pour ajouter des produits au panier');
      return throwError(() => new Error('Utilisateur non connecté'));
    }
    
    const userId = currentUser.id;
    
    console.log(`🛒 Ajout au panier via ProductService: 👤 userId=${userId}, 📦 productId=${productId}, 🔢 quantity=${quantity}`);
    
    // On utilise le service ShoppingCartService pour garder la cohérence
    // Importer le service avec l'injecteur pour éviter les dépendances circulaires
    const shoppingCartService = this.injector.get(ShoppingCartService);
    
    // Ajouter l'article et s'assurer que le sujet qui diffuse les mises à jour du panier est notifié
    return shoppingCartService.addToCart(productId, quantity);
  }
} 