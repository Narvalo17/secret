import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Store } from '@core/models/store.model';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';

export interface FavoriteStoreFilter {
  location?: string;
  category?: string;
  rating?: number;
  distance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteStoreService {
  private apiUrl = `${environment.apiUrl}/favorite-stores`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Récupérer tous les magasins favoris de l'utilisateur
  getFavoriteStores(): Observable<Store[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      return of([]);
    }
    
    return this.http.get<any>(`${this.apiUrl}/user/${currentUser.id}`)
      .pipe(
        map(response => {
          if (response && response.content) {
            return response.content.map((store: any) => this.mapStoreFromApiResponse(store));
          }
          if (Array.isArray(response)) {
            return response.map((store: any) => this.mapStoreFromApiResponse(store));
          }
          return [];
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des favoris', error);
          return of([]);
        })
      );
  }

  // Ajouter un magasin aux favoris
  addToFavorites(storeId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    return this.http.post(`${this.apiUrl}/user/${currentUser.id}`, {}, {
      params: { storeId: storeId.toString() }
    });
  }

  // Retirer un magasin des favoris
  removeFromFavorites(storeId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    return this.http.delete(`${this.apiUrl}/user/${currentUser.id}/store/${storeId}`);
  }

  // Vérifier si un magasin est dans les favoris
  isInFavorites(storeId: number): Observable<boolean> {
    return this.getFavoriteStores().pipe(
      map(stores => stores.some(store => store.id === storeId)),
      catchError(() => of(false))
    );
  }

  // Méthode privée pour mapper les données de l'API au format attendu par le frontend
  private mapStoreFromApiResponse(store: any): Store {
    return {
      id: store.id,
      name: store.name,
      description: store.description,
      address: store.address,
      phone: store.phone,
      email: store.email,
      website: store.website,
      ownerId: store.ownerId,
      image_url: store.imageUrl,
      storeType: store.storeType,
      storeTypeName: store.storeTypeName,
      is_active: store.isActive,
      slug: store.slug,
      isFavorite: true
    };
  }

  getFilteredStores(filters: FavoriteStoreFilter): Observable<Store[]> {
    return this.http.post<Store[]>(`${this.apiUrl}/filters`, filters);
  }
} 