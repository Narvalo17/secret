import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, StoreResponse, CreateStoreDto } from '@core/models/store.model';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // GET /api/stores - Obtenir tous les magasins
  getAllStores(filters?: { ownerId?: number; isActive?: boolean }): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiUrl}`, { params: { ...filters } as any });
  }

  // GET /api/stores/{id} - Obtenir un magasin
  getStoreById(id: number): Observable<{ success: boolean; message: string; data?: Store }> {
    return this.http.get<{ success: boolean; message: string; data?: Store }>(`${this.apiUrl}/${id}`);
  }

  // POST /api/stores - Créer un magasin
  createStore(store: CreateStoreDto): Observable<{ success: boolean; data: Store }> {
    return this.http.post<{ success: boolean; data: Store }>(`${this.apiUrl}`, store);
  }

  // PUT /api/stores/{id} - Mettre à jour un magasin
  updateStore(id: number, store: Partial<Store>): Observable<{ success: boolean; data: Store }> {
    return this.http.put<{ success: boolean; data: Store }>(`${this.apiUrl}/${id}`, store);
  }

  // DELETE /api/stores/{id} - Supprimer un magasin
  deleteStore(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  // PUT /api/stores/{id}/status - Mettre à jour le statut d'un magasin
  updateStoreStatus(id: number, isActive: boolean): Observable<{ success: boolean; data: Store }> {
    return this.http.put<{ success: boolean; data: Store }>(`${this.apiUrl}/${id}/status`, { isActive });
  }

  // GET /api/stores/search - Rechercher des magasins
  searchStores(query: string): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiUrl}/search`, {
      params: { query }
    });
  }

  // GET /api/stores/category/{categoryName} - Obtenir les magasins par catégorie
  getStoresByCategory(category: string): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiUrl}/category/${category}`);
  }

  // Méthodes pour les favoris
  addToFavorites(storeId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    return this.http.post(`${environment.apiUrl}/favorite-stores/user/${currentUser.id}`, {}, {
      params: { storeId: storeId.toString() }
    });
  }

  removeFromFavorites(storeId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    return this.http.delete(`${environment.apiUrl}/favorite-stores/user/${currentUser.id}/store/${storeId}`);
  }

  getFavoriteStores(): Observable<StoreResponse> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.get<StoreResponse>(`${environment.apiUrl}/favorite-stores/user/${currentUser.id}`);
  }
} 