import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Store, StoreType } from '@core/models/store.model';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  // GET /api/stores - Obtenir tous les magasins
  getAllStores(filters?: { ownerId?: number; isActive?: boolean }): Observable<Store[]> {
    const params = new HttpParams({ fromObject: { ...filters } as any });
    return this.http.get<any>(this.apiUrl, { params })
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
          console.error('Erreur lors de la récupération des magasins', error);
          return of([]);
        })
      );
  }

  // GET /api/stores/{id} - Obtenir un magasin
  getStoreById(id: number): Observable<Store> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(store => this.mapStoreFromApiResponse(store)),
        catchError(error => {
          console.error(`Erreur lors de la récupération du magasin ${id}`, error);
          throw error;
        })
      );
  }

  // GET /api/stores avec le filtre ownerId - Obtenir le magasin d'un propriétaire
  getStoreByOwnerId(ownerId: number): Observable<{ success: boolean; message: string; data?: Store }> {
    console.log(`Recherche du magasin pour le propriétaire ID: ${ownerId}`);
    
    const url = `${this.apiUrl}?ownerId=${ownerId}`;
    console.log(`Requête API: ${url}`);
    
    return this.http.get<any>(url)
      .pipe(
        map(response => {
          console.log('Réponse du serveur pour les magasins:', response);
          
          if (!response || !response.content) {
            console.error('Format de réponse invalide:', response);
            return { 
              success: false, 
              message: 'Format de réponse invalide', 
              data: undefined 
            };
          }
          
          console.log(`Nombre de magasins trouvés: ${response.content.length}`);
          
          // Filtrer explicitement les magasins par ownerId pour s'assurer qu'on a le bon
          const storeForOwner = response.content.find((store: Store) => 
            store.ownerId === ownerId || 
            store.owner_id === ownerId
          );
          
          if (storeForOwner) {
            console.log(`Magasin trouvé pour le propriétaire ID ${ownerId}:`, storeForOwner);
            return {
              success: true,
              message: 'Magasin trouvé',
              data: storeForOwner
            };
          } else if (response.content.length > 0) {
            // Si aucun magasin ne correspond exactement, prendre le premier (cas de repli)
            console.log('Aucun magasin ne correspond exactement, utilisation du premier:', response.content[0]);
            return {
              success: true,
              message: 'Magasin trouvé (par défaut)',
              data: response.content[0]
            };
          } else {
            console.log(`Aucun magasin trouvé pour le propriétaire ID: ${ownerId}`);
            return {
              success: false,
              message: 'Aucun magasin trouvé',
              data: undefined
            };
          }
        })
      );
  }

  // POST /api/stores - Créer un magasin
  createStore(store: Store): Observable<Store> {
    return this.http.post<any>(this.apiUrl, store)
      .pipe(
        map(response => this.mapStoreFromApiResponse(response)),
        tap(() => {
          this.notificationService.success('Magasin créé avec succès');
        }),
        catchError(error => {
          console.error('Erreur lors de la création du magasin', error);
          this.notificationService.error('Erreur lors de la création du magasin');
          throw error;
        })
      );
  }

  // PUT /api/stores/{id} - Mettre à jour un magasin
  updateStore(id: number, store: Store): Observable<Store> {
    console.log('📝 Mise à jour du magasin:', id);
    
    // Construire un DTO qui correspond exactement aux attentes du backend
    const storeDto = {
      id: id,
      name: store.name,
      description: store.description || '',
      address: store.address,
      phone: store.phone || '',
      email: store.email || '',
      website: store.website || '',
      imageUrl: store.image_url || '',
      ownerId: store.ownerId || store.owner_id,
      storeType: store.storeType,
      isActive: store.is_active !== undefined ? store.is_active : true,
      firstName: store.firstName || '',
      lastName: store.lastName || '',
      password: store.password || 'defaultPassword',
      confirmPassword: store.confirmPassword || store.password || 'defaultPassword'
    };
    
    console.log('Données envoyées pour mise à jour:', JSON.stringify(storeDto));
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, storeDto)
      .pipe(
        map(response => {
          console.log('✅ Réponse de mise à jour:', response);
          return this.mapStoreFromApiResponse(response);
        }),
        tap(() => {
          this.notificationService.success('Magasin mis à jour avec succès');
        }),
        catchError(error => {
          console.error(`❌ Erreur lors de la mise à jour du magasin ${id}`, error);
          if (error.error) {
            console.error('Détails de l\'erreur:', JSON.stringify(error.error));
            if (error.error.message) {
              console.error('Message d\'erreur:', error.error.message);
            }
            if (error.error.errors) {
              console.error('Erreurs de validation:', error.error.errors);
              
              // Log détaillé des erreurs de validation
              if (Array.isArray(error.error.errors)) {
                error.error.errors.forEach((err: any, index: number) => {
                  console.error(`Erreur ${index + 1}:`, err);
                });
              }
            }
          }
          this.notificationService.error('Erreur lors de la mise à jour du magasin');
          throw error;
        })
      );
  }

  // DELETE /api/stores/{id} - Supprimer un magasin
  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.notificationService.success('Magasin supprimé avec succès');
        }),
        catchError(error => {
          console.error(`Erreur lors de la suppression du magasin ${id}`, error);
          this.notificationService.error('Erreur lors de la suppression du magasin');
          throw error;
        })
      );
  }

  // PUT /api/stores/{id}/status - Mettre à jour le statut d'un magasin
  updateStoreStatus(id: number, isActive: boolean): Observable<{ success: boolean; data: Store }> {
    return this.http.put<{ success: boolean; data: Store }>(`${this.apiUrl}/${id}/status`, { isActive });
  }

  // GET /api/stores/search - Rechercher des magasins
  searchStores(query: string): Observable<Store[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(`${this.apiUrl}/search`, { params })
      .pipe(
        map(response => {
          if (response && response.content) {
            return response.content.map((store: any) => this.mapStoreFromApiResponse(store));
          }
          return [];
        }),
        catchError(error => {
          console.error('Erreur lors de la recherche de magasins', error);
          return of([]);
        })
      );
  }

  // GET /api/stores/category/{categoryName} - Obtenir les magasins par catégorie
  getStoresByCategory(category: string): Observable<Store[]> {
    return this.http.get<any>(`${this.apiUrl}/category/${category}`)
      .pipe(
        map(response => {
          if (response && response.content) {
            return response.content.map((store: any) => this.mapStoreFromApiResponse(store));
          }
          return [];
        }),
        catchError(error => {
          console.error(`Erreur lors de la récupération des magasins de catégorie ${category}`, error);
          return of([]);
        })
      );
  }

  // GET /api/stores/type/{type} - Obtenir les magasins par type
  getStoresByType(type: StoreType): Observable<Store[]> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`)
      .pipe(
        map(response => {
          if (response && response.content) {
            return response.content.map((store: any) => this.mapStoreFromApiResponse(store));
          }
          return [];
        }),
        catchError(error => {
          console.error(`Erreur lors de la récupération des magasins de type ${type}`, error);
          return of([]);
        })
      );
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

  getFavoriteStores(): Observable<Store[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.get<any>(`${environment.apiUrl}/favorite-stores/user/${currentUser.id}`)
      .pipe(
        map(response => {
          if (response && response.content) {
            return response.content.map((store: any) => this.mapStoreFromApiResponse(store));
          }
          return [];
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des favoris', error);
          return of([]);
        })
      );
  }

  // GET /api/stores/owner/{ownerId} - Obtenir le magasin de l'utilisateur connecté
  getCurrentUserStore(): Observable<{ success: boolean; data?: Store }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.get<any>(`${this.apiUrl}/owner/${currentUser.id}`)
      .pipe(
        map(response => {
          if (response && response.content && response.content.length > 0) {
            return {
              success: true,
              data: this.mapStoreFromApiResponse(response.content[0])
            };
          }
          return { success: false };
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération du magasin:', error);
          return of({ success: false });
        })
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
      firstName: store.firstName,
      lastName: store.lastName
    };
  }
} 