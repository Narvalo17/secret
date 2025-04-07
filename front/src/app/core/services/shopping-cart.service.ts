import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject, map } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';
import { ShoppingCart, ShoppingCartItem } from '../models/shopping-cart.ts';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private readonly apiUrl = `${environment.apiUrl}`;
  private localCartCache: Map<number, ShoppingCart> = new Map(); // Cache local par userId
  
  // Nouvel observable pour les mises à jour du panier
  private cartSubject = new BehaviorSubject<ShoppingCart>({ items: [] });
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    // Charger le panier au démarrage du service
    this.initCart();
  }
  
  private initCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.getShoppingCart().subscribe(cart => {
        this.cartSubject.next(cart);
      });
    }
  }
  
  // Méthode pour obtenir le nombre total d'articles dans le panier
  public getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      tap(cart => console.log('📊 Observable cart$ mise à jour:', cart)),
      // Transférer ShoppingCart en nombre d'articles
      map((cart: ShoppingCart) => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((count, item) => count + (item.quantity || 0), 0);
      }),
      catchError(error => {
        console.error('❌ Erreur dans getCartItemCount:', error);
        return of(0);
      })
    );
  }

  getShoppingCart(): Observable<ShoppingCart> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('⚠️ Tentative de récupération du panier sans utilisateur connecté');
      return of({ items: [] });
    }
    
    const userId = currentUser.id;
    
    // Vérifier d'abord le cache local
    if (this.localCartCache.has(userId)) {
      const cachedCart = this.localCartCache.get(userId);
      console.log('🗄️ Utilisation du cache local pour le panier:', cachedCart);
      // Émettre les nouvelles données via le subject
      this.cartSubject.next(cachedCart!);
      return of(cachedCart!);
    }
    
    // Essayons plusieurs endpoints possibles
    const url1 = `${this.apiUrl}/shopping/cart/user/${userId}`;
    const url2 = `${this.apiUrl}/carts/user/${userId}`;
    const url3 = `${this.apiUrl}/shopping/cart/items`;
    const url4 = `${this.apiUrl}/shopping/cart/items/user/${userId}/all`; 
    
    console.log(`🔍 Tentative récupération du panier avec plusieurs endpoints. userId=${userId}`);
    console.log(`🛒 Tentative #1: ${url1}`);
    
    // Essayer d'abord le premier endpoint
    return this.http.get<ShoppingCart>(url1).pipe(
      tap(cart => {
        console.log('✅ Panier récupéré avec succès (URL1):', cart);
        this.logCartDetails(cart);
        this.updateLocalCache(userId, cart);
        // Émettre les nouvelles données via le subject
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.warn(`⚠️ Erreur avec URL1: ${error.status} ${error.statusText}`);
        
        // En cas d'échec, essayer le deuxième endpoint
        console.log(`🛒 Tentative #2: ${url2}`);
        return this.http.get<ShoppingCart>(url2).pipe(
          tap(cart => {
            console.log('✅ Panier récupéré avec succès (URL2):', cart);
            this.logCartDetails(cart);
            this.updateLocalCache(userId, cart);
            // Émettre les nouvelles données via le subject
            this.cartSubject.next(cart);
          }),
          catchError(error2 => {
            console.warn(`⚠️ Erreur avec URL2: ${error2.status} ${error2.statusText}`);
            
            // En cas d'échec, essayer le troisième endpoint
            console.log(`🛒 Tentative #3: ${url3}?userId=${userId}`);
            return this.http.get<ShoppingCart>(`${url3}?userId=${userId}`).pipe(
              tap(cart => {
                console.log('✅ Panier récupéré avec succès (URL3):', cart);
                this.logCartDetails(cart);
                this.updateLocalCache(userId, cart);
                // Émettre les nouvelles données via le subject
                this.cartSubject.next(cart);
              }),
              catchError(error3 => {
                console.warn(`⚠️ Erreur avec URL3: ${error3.status} ${error3.statusText}`);
                
                // En cas d'échec, essayer le quatrième endpoint
                console.log(`🛒 Tentative #4: ${url4}`);
                return this.http.get<ShoppingCart>(url4).pipe(
                  tap(cart => {
                    console.log('✅ Panier récupéré avec succès (URL4):', cart);
                    this.logCartDetails(cart);
                    this.updateLocalCache(userId, cart);
                    // Émettre les nouvelles données via le subject
                    this.cartSubject.next(cart);
                  }),
                  catchError(error4 => {
                    console.error('❌ Tous les endpoints ont échoué. Utilisation du cache s\'il existe.');
                    this.debugCartOptions(userId);
                    
                    // Si toutes les tentatives échouent mais que nous avons un cache, l'utiliser
                    if (this.localCartCache.has(userId)) {
                      const cachedCart = this.localCartCache.get(userId)!;
                      console.log('🗄️ Fallback vers le cache local après échec des endpoints:', cachedCart);
                      // Émettre les données du cache via le subject
                      this.cartSubject.next(cachedCart);
                      return of(cachedCart);
                    }
                    
                    this.cartSubject.next({ items: [] });
                    return of({ items: [] });
                  })
                );
              })
            );
          })
        );
      })
    );
  }
  
  private updateLocalCache(userId: number, cart: ShoppingCart): void {
    if (cart && userId) {
      console.log(`🗄️ Mise à jour du cache local pour userId=${userId}`);
      this.localCartCache.set(userId, cart);
      
      // Émettre les nouvelles données via le subject
      this.cartSubject.next(cart);
    }
  }
  
  private logCartDetails(cart: ShoppingCart): void {
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log('⚠️ Le panier est vide');
    } else {
      console.log(`📊 Nombre d'articles dans le panier: ${cart.items.length}`);
      console.log(`💰 Montant total: ${cart.totalAmount}`);
      
      // Détails des articles
      console.log('📋 Détails des articles:');
      cart.items.forEach((item, index) => {
        console.log(`  Item #${index + 1}: productId=${item.productId}, quantity=${item.quantity}, name=${item.productName}`);
      });
    }
  }

  private debugCartOptions(userId: number): void {
    console.log(`🔧 Débogage des options de panier pour userId=${userId}`);
    console.log(`🌐 API URL de base: ${this.apiUrl}`);
    console.log(`💡 Suggestion: Vérifiez les logs côté serveur pour comprendre quel endpoint est implémenté.`);
    console.log(`💡 Suggestion: Si les articles ont bien été ajoutés, c'est que l'API d'ajout fonctionne,`);
    console.log(`   mais l'API de récupération n'est peut-être pas implémentée ou ne retourne pas les bons items.`);
  }

  addToCart(productId: number, quantity: number = 1): Observable<ShoppingCart> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('⚠️ Tentative d\'ajout au panier sans utilisateur connecté');
      return of({ items: [] });
    }
    
    const userId = currentUser.id;
    const url1 = `${this.apiUrl}/shopping/cart/items/user/${userId}`;
    const url2 = `${this.apiUrl}/carts/user/${userId}/items`;
    
    console.log(`🛒 Tentative d'ajout au panier (URL1): ${url1}`);
    console.log(`📦 Produit: ${productId}, Quantité: ${quantity}`);
    
    const cartDetail = { 
      productId: Number(productId), 
      quantity: Math.max(1, Math.round(Number(quantity)))
    };
    
    // Essayer d'abord le premier endpoint (body)
    return this.http.post<ShoppingCart>(url1, cartDetail).pipe(
      tap(cart => {
        console.log('✅ Produit ajouté au panier avec succès (URL1):', cart);
        this.logCartDetails(cart);
        
        // Mise à jour du cache local
        this.updateLocalCache(userId, cart);
        
        // Si la réponse ne contient pas l'article que nous venons d'ajouter, l'ajouter manuellement au cache
        if (cart && cart.items && !cart.items.some(item => item.productId === productId)) {
          console.log('⚠️ L\'article ajouté n\'est pas dans la réponse, mise à jour du cache manuellement');
          this.addItemToLocalCache(userId, productId, quantity);
        }
      }),
      catchError(error => {
        console.warn(`⚠️ Erreur avec URL1: ${error.status} ${error.statusText}`);
        if (error.error) console.warn('Message:', error.error.message || error.error);
        
        // En cas d'échec, essayer le deuxième endpoint (query params)
        const url2WithParams = `${url2}?productId=${productId}&quantity=${cartDetail.quantity}`;
        console.log(`🛒 Tentative d'ajout au panier (URL2): ${url2WithParams}`);
        
        return this.http.post<ShoppingCart>(url2WithParams, {}).pipe(
          tap(cart => {
            console.log('✅ Produit ajouté au panier avec succès (URL2):', cart);
            this.logCartDetails(cart);
            
            // Mise à jour du cache local
            this.updateLocalCache(userId, cart);
            
            // Si la réponse ne contient pas l'article que nous venons d'ajouter, l'ajouter manuellement au cache
            if (cart && cart.items && !cart.items.some(item => item.productId === productId)) {
              console.log('⚠️ L\'article ajouté n\'est pas dans la réponse, mise à jour du cache manuellement');
              this.addItemToLocalCache(userId, productId, quantity);
            }
          }),
          catchError(error2 => {
            console.error('❌ Les deux endpoints ont échoué:', error2);
            if (error2.error) console.error('Message:', error2.error.message || error2.error);
            
            // Même si l'API échoue, essayons de maintenir un état de panier côté client
            this.addItemToLocalCache(userId, productId, quantity);
            
            // Retourner le cache local
            if (this.localCartCache.has(userId)) {
              return of(this.localCartCache.get(userId)!);
            }
            
            return throwError(() => new Error('Impossible d\'ajouter le produit au panier'));
          })
        );
      })
    );
  }
  
  private addItemToLocalCache(userId: number, productId: number, quantity: number): void {
    console.log(`🗄️ Ajout manuel d'un article au cache local: userId=${userId}, productId=${productId}, quantity=${quantity}`);
    
    let cart: ShoppingCart;
    if (this.localCartCache.has(userId)) {
      cart = {...this.localCartCache.get(userId)!};
    } else {
      cart = { items: [] };
    }
    
    // Recherche si le produit est déjà dans le panier
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité
      cart.items[existingItemIndex].quantity += quantity;
      console.log(`📝 Quantité mise à jour pour le produit ${productId}, nouvelle quantité: ${cart.items[existingItemIndex].quantity}`);
    } else {
      // Ajouter un nouvel article
      const newItem: ShoppingCartItem = {
        productId: productId,
        quantity: quantity,
      };
      
      // Essayer de récupérer les détails du produit pour enrichir l'item
      this.getProductDetails(productId).subscribe(
        (product) => {
          if (product) {
            newItem.productName = product.name;
            newItem.productPrice = product.price;
            newItem.productImage = product.imageUrl;
            console.log(`✅ Détails du produit récupérés pour le produit ${productId}:`, product);
            
            // Mettre à jour le cache
            const updatedCart = this.localCartCache.get(userId)!;
            const itemToUpdate = updatedCart.items.find(item => item.productId === productId);
            if (itemToUpdate) {
              Object.assign(itemToUpdate, newItem);
              this.localCartCache.set(userId, updatedCart);
              console.log(`🔄 Cache mis à jour avec les détails du produit`);
            }
          }
        },
        error => console.error(`❌ Impossible de récupérer les détails du produit ${productId}:`, error)
      );
      
      cart.items.push(newItem);
      console.log(`➕ Nouvel article ajouté au panier local: ${productId}`);
    }
    
    // Mise à jour du cache
    this.localCartCache.set(userId, cart);
  }
  
  /**
   * Récupère les détails d'un produit à partir de son ID
   */
  getProductDetails(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${productId}`).pipe(
      catchError(error => {
        console.error(`❌ Erreur lors de la récupération des détails du produit ${productId}:`, error);
        return of(null);
      })
    );
  }

  removeFromCart(productId: number): Observable<ShoppingCart> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('⚠️ Tentative de suppression du panier sans utilisateur connecté');
      return of({ items: [] });
    }
    
    const userId = currentUser.id;
    const url = `${this.apiUrl}/shopping/cart/items/${productId}/user/${userId}`;
    
    console.log(`🗑️ Suppression du panier: 👤 userId=${userId}, 📦 productId=${productId}`);
    console.log(`📡 DELETE vers ${url}`);
    
    return this.http.delete<ShoppingCart>(url).pipe(
      tap(cart => {
        console.log('✅ Produit supprimé du panier avec succès');
        this.logCartDetails(cart);
        
        // Mise à jour du cache local
        this.updateLocalCache(userId, cart);
        
        // Émettre la mise à jour via le subject pour notifier tous les abonnés
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('❌ Erreur lors de la suppression du produit du panier:', error);
        
        if (error.error && error.error.message) {
          console.error('⚠️ Message d\'erreur du serveur:', error.error.message);
        }
        
        // Suppression de l'article du cache local même en cas d'erreur
        if (this.localCartCache.has(userId)) {
          const cart = {...this.localCartCache.get(userId)!};
          cart.items = cart.items.filter(item => item.productId !== productId);
          
          // Recalculer les totaux
          cart.totalItems = cart.items.length;
          cart.totalAmount = this.calculateTotal(cart.items);
          
          this.localCartCache.set(userId, cart);
          
          // Émettre la mise à jour via le subject pour notifier tous les abonnés
          this.cartSubject.next(cart);
          
          console.log('🗄️ Article supprimé du cache local');
          return of(cart);
        }
        
        return throwError(() => new Error('Impossible de supprimer le produit du panier'));
      })
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<ShoppingCart> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('⚠️ Tentative de mise à jour du panier sans utilisateur connecté');
      return of({ items: [] });
    }
    
    const userId = currentUser.id;
    const url = `${this.apiUrl}/carts/user/${userId}/items/${productId}`;
    
    console.log(`📝 Mise à jour quantité: 👤 userId=${userId}, 📦 productId=${productId}, 🔢 quantity=${quantity}`);
    console.log(`📡 PUT vers ${url} avec quantity=${quantity}`);
    
    return this.http.put<ShoppingCart>(`${url}?quantity=${quantity}`, {}).pipe(
      tap(cart => {
        console.log('✅ Quantité mise à jour avec succès');
        this.logCartDetails(cart);
        
        // Mise à jour du cache local
        this.updateLocalCache(userId, cart);
      }),
      catchError(error => {
        console.error('❌ Erreur lors de la mise à jour de la quantité:', error);
        
        if (error.error && error.error.message) {
          console.error('⚠️ Message d\'erreur du serveur:', error.error.message);
        }
        
        // Mise à jour de la quantité dans le cache local
        if (this.localCartCache.has(userId)) {
          const cart = {...this.localCartCache.get(userId)!};
          const itemIndex = cart.items.findIndex(item => item.productId === productId);
          if (itemIndex >= 0) {
            cart.items[itemIndex].quantity = quantity;
            this.localCartCache.set(userId, cart);
            console.log('🗄️ Quantité mise à jour dans le cache local');
            return of(cart);
          }
        }
        
        return throwError(() => new Error('Impossible de mettre à jour la quantité'));
      })
    );
  }

  clearCart(): Observable<ShoppingCart> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.warn('⚠️ Tentative de vidage du panier sans utilisateur connecté');
      return of({ items: [] });
    }
    
    const userId = currentUser.id;
    const url = `${this.apiUrl}/shopping/cart/user/${userId}/clear`;
    
    // Créer un panier vide structuré
    const emptyCart: ShoppingCart = { 
      items: [], 
      userId: userId,
      totalAmount: 0,
      totalItems: 0
    };
    
    console.log(`🧹 Tentative de vidage du panier: userId=${userId}`);
    
    // Essayons d'abord d'appeler le backend s'il existe une API pour vider le panier
    return this.http.delete<ShoppingCart>(url).pipe(
      tap(cart => {
        console.log('✅ Panier vidé avec succès côté backend');
        this.updateLocalCache(userId, cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.warn('⚠️ API de vidage du panier non disponible ou erreur:', error);
        
        // Même en cas d'erreur, on vide le cache local
        this.localCartCache.set(userId, emptyCart);
        
        // Notifier tous les abonnés que le panier est désormais vide
        this.cartSubject.next(emptyCart);
        
        console.log('🧹 Cache local vidé manuellement');
        return of(emptyCart);
      })
    );
  }

  // Méthode utilitaire pour calculer le total du panier
  calculateTotal(items: ShoppingCartItem[]): number {
    return items.reduce((sum, item) => {
      return sum + ((item.productPrice || 0) * (item.quantity || 1));
    }, 0);
  }
} 