import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, StoreResponse, CreateStoreDto } from '@core/models/store.model';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth.service';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

  // GET /api/stores avec le filtre ownerId - Obtenir le magasin d'un propriétaire
  getStoreByOwnerId(ownerId: number): Observable<{ success: boolean; message: string; data?: Store }> {
    console.log(`Recherche du magasin pour le propriétaire ID: ${ownerId}`);
    
    const url = `${this.apiUrl}?ownerId=${ownerId}`;
    console.log(`Requête API: ${url}`);
    
    return this.http.get<StoreResponse>(url).pipe(
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
        const storeForOwner = response.content.find(store => 
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
  createStore(store: CreateStoreDto): Observable<{ success: boolean; data: Store }> {
    return this.http.post<{ success: boolean; data: Store }>(`${this.apiUrl}`, store);
  }

  // PUT /api/stores/{id} - Mettre à jour un magasin
  updateStore(id: number, store: Partial<Store>): Observable<{ success: boolean; data: Store }> {
    console.log(`Préparation de la mise à jour du magasin ID: ${id}`);
    console.log('Données brutes reçues:', JSON.stringify(store));
    
    // Format strict conforme au schéma JSON attendu par l'API
    // On ne garde que les propriétés essentielles attendues par le backend
    const storeData: Record<string, any> = {
      name: store.name,
      description: store.description,
      address: store.address || '',
      phone: store.phone || '',
      email: store.email || '',
      website: store.website || '',
      ownerId: store.ownerId || store.owner_id,
      password: store.password || '',
      confirmPassword: store.password || '',  // Utiliser le même mot de passe pour la confirmation
      firstName: store.firstName || '',
      lastName: store.lastName || ''
    };

    // Si imageUrl est fourni, on l'inclut
    if (store.image_url) {
      storeData['imageUrl'] = store.image_url;
    }
    
    // Supprimer toute propriété undefined ou null pour éviter des problèmes d'API
    Object.keys(storeData).forEach(key => {
      if (storeData[key] === undefined || storeData[key] === null || storeData[key] === '') {
        delete storeData[key];
      }
    });
    
    console.log('Données formatées pour l\'API:', JSON.stringify(storeData));
    
    return this.http.put<any>(
      `${this.apiUrl}/${id}`, 
      storeData,
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      map(response => {
        console.log('Réponse API brute:', response);
        // Transformer la réponse au format attendu par le frontend
        return {
          success: true,
          data: this.mapStoreFromApiResponse(response)
        };
      }),
      catchError(error => {
        console.error('Erreur API détaillée:', error);
        console.error('Corps de l\'erreur:', error.error);
        return throwError(() => error);
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
      category: store.category || store.categoryName,
      is_active: store.isActive,
      firstName: store.firstName,
      lastName: store.lastName
    };
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

  // GET /api/stores/owner/{ownerId} - Obtenir le magasin de l'utilisateur connecté
  getCurrentUserStore(): Observable<{ success: boolean; data: Store }> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.get<StoreResponse>(`${this.apiUrl}/owner/${currentUser.id}`).pipe(
      map(response => {
        if (response && response.content && response.content.length > 0) {
          return {
            success: true,
            data: response.content[0]
          };
        }
        throw new Error('Aucun magasin trouvé pour cet utilisateur');
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du magasin:', error);
        return throwError(() => error);
      })
    );
  }
} 