import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@core/models/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private stores: Store[] = [
    {
      id: 1,
      name: 'Le Pain Quotidien',
      description: 'Boulangerie artisanale proposant des pains bio et des viennoiseries fraîches à prix réduits en fin de journée.',
      address: '15 Rue de la Paix, 75002 Paris',
      imageUrl: 'assets/images/stores/boulangerie.jpg',
      category: 'Boulangeries',
      rating: 4.5,
      distance: 0.8,
      isFavorite: false,
      openingHours: '7h00 - 20h00',
      phone: '01 42 68 15 00',
      userId: 1
    },
    {
      id: 2,
      name: 'Super Frais',
      description: 'Supermarché avec un grand choix de produits frais. Réductions importantes sur les produits proche de la date limite.',
      address: '45 Avenue des Champs-Élysées, 75008 Paris',
      imageUrl: 'assets/images/stores/supermarche.jpg',
      category: 'Supermarchés',
      rating: 4.2,
      distance: 1.2,
      isFavorite: false,
      openingHours: '8h00 - 22h00',
      phone: '01 45 62 35 00',
      userId: 1
    },
    {
      id: 3,
      name: 'Bistrot du Chef',
      description: 'Restaurant traditionnel proposant des plats du jour à emporter à prix réduits en fin de service.',
      address: '28 Rue du Commerce, 75015 Paris',
      imageUrl: 'assets/images/stores/restaurant.jpg',
      category: 'Restaurants',
      rating: 4.8,
      distance: 0.5,
      isFavorite: false,
      openingHours: '11h30 - 23h00',
      phone: '01 44 25 15 75',
      userId: 1
    },
    {
      id: 4,
      name: 'La Petite Boulange',
      description: 'Boulangerie familiale offrant des promotions sur les invendus du jour.',
      address: '8 Rue des Martyrs, 75009 Paris',
      imageUrl: 'assets/images/stores/boulangerie2.jpg',
      category: 'Boulangeries',
      rating: 4.6,
      distance: 1.5,
      isFavorite: false,
      openingHours: '6h30 - 20h30',
      phone: '01 48 78 32 10',
      userId: 1
    }
  ];

  constructor() {}

  getAllStores(): Observable<{ success: boolean; data: Store[] }> {
    return of({ success: true, data: this.stores });
  }

  getStoreById(id: number): Observable<{ success: boolean; data: Store | null; message?: string }> {
    const store = this.stores.find(s => s.id === id);
    if (!store) {
      return of({ 
        success: false, 
        data: null, 
        message: `Magasin avec l'ID ${id} non trouvé` 
      });
    }
    return of({ success: true, data: store });
  }

  addToFavorites(storeId: number): Observable<{ success: boolean }> {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.isFavorite = true;
    }
    return of({ success: true });
  }

  removeFromFavorites(storeId: number): Observable<{ success: boolean }> {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.isFavorite = false;
    }
    return of({ success: true });
  }

  getFavoriteStores(): Observable<{ success: boolean; data: Store[] }> {
    const favorites = this.stores.filter(store => store.isFavorite);
    return of({ success: true, data: favorites });
  }
} 