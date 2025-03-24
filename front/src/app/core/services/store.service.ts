import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Store, StoreResponse, CreateStoreDto } from '@core/models/store.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  // Données de test
  private mockStores: Store[] = [
    {
      id: 1,
      name: 'Boulangerie du Coin',
      description: 'Pains et viennoiseries artisanales',
      category: 'Boulangerie',
      location: 'Paris 11ème',
      address: '123 rue de la Paix',
      openingHours: '7h-20h',
      contactEmail: 'boulangerie@example.com',
      contactPhone: '01 23 45 67 89',
      imageUrl: 'assets/images/bakery.jpg',
      rating: 4.5,
      isFavorite: false,
      products: [
        {
          id: 1,
          name: 'Baguette Tradition',
          description: 'Baguette traditionnelle à l\'ancienne',
          originalPrice: 1.20,
          discountPercentage: 50,
          currentPrice: 0.60,
          quantity: 15,
          imageUrl: 'assets/images/baguette.jpg',
          category: 'Pain',
          price: 0,
          stock: 0
        },
        
        {
          id: 2,
          name: 'Croissant au beurre',
          description: 'Croissant pur beurre',
          originalPrice: 1.50,
          discountPercentage: 40,
          currentPrice: 0.90,
          quantity: 20,
          imageUrl: 'assets/images/croissant.jpg',
          category: 'Viennoiserie',
          price: 0,
          stock: 0
        }
      ]
    },
    {
      id: 2,
      name: 'Primeur des 4 Saisons',
      description: 'Fruits et légumes frais',
      category: 'Primeur',
      location: 'Paris 12ème',
      address: '45 avenue Daumesnil',
      openingHours: '8h-19h30',
      contactEmail: 'primeur@example.com',
      contactPhone: '01 23 45 67 90',
      imageUrl: 'assets/images/grocery.jpg',
      rating: 4.2,
      isFavorite: false,
      products: [
        {
          id: 3,
          name: 'Panier de légumes bio',
          description: 'Assortiment de légumes bio de saison',
          originalPrice: 25.00,
          discountPercentage: 30,
          currentPrice: 17.50,
          quantity: 10,
          imageUrl: 'assets/images/vegetables.jpg',
          category: 'Légumes',
          price: 0,
          stock: 0
        },
        {
          id: 4,
          name: 'Fruits rouges',
          description: 'Mix de fruits rouges frais',
          originalPrice: 4.50,
          discountPercentage: 20,
          currentPrice: 3.60,
          quantity: 8,
          imageUrl: 'assets/images/berries.jpg',
          category: 'Fruits',
          price: 0,
          stock: 0
        }
      ]
    },
    {
      id: 3,
      name: 'Pâtisserie Gourmande',
      description: 'Pâtisseries artisanales',
      category: 'Pâtisserie',
      location: 'Paris 15ème',
      address: '78 rue du Commerce',
      openingHours: '9h-19h',
      contactEmail: 'patisserie@example.com',
      contactPhone: '01 23 45 67 91',
      imageUrl: 'assets/images/pastry.jpg',
      rating: 4.8,
      isFavorite: false,
      products: [
        {
          id: 5,
          name: 'Éclair au chocolat',
          description: 'Éclair garni de crème au chocolat noir',
          originalPrice: 4.00,
          discountPercentage: 25,
          currentPrice: 3.00,
          quantity: 12,
          imageUrl: 'assets/images/eclair.jpg',
          category: 'Pâtisserie',
          price: 0,
          stock: 0
        },
        {
          id: 6,
          name: 'Tarte aux fruits',
          description: 'Tarte aux fruits de saison',
          originalPrice: 18.00,
          discountPercentage: 15,
          currentPrice: 15.30,
          quantity: 5,
          imageUrl: 'assets/images/fruit-tart.jpg',
          category: 'Pâtisserie',
          price: 0,
          stock: 0
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<StoreResponse> {
    // Pour le développement, utilisons les données mockées
    return of({
      success: true,
      message: 'Stores retrieved successfully',
      data: this.mockStores
    });
  }

  getStoreById(id: number): Observable<{ success: boolean; message: string; data?: Store }> {
    const store = this.mockStores.find(s => s.id === id);
    return of({
      success: true,
      message: store ? 'Store found' : 'Store not found',
      data: store
    });
  }

  getStoreProducts(storeId: number): Observable<any> {
    const store = this.mockStores.find(s => s.id === storeId);
    return of({
      success: true,
      message: 'Products retrieved successfully',
      data: store?.products || []
    });
  }

  createStore(store: CreateStoreDto): Observable<{ success: boolean; data: Store }> {
    return this.http.post<{ success: boolean; data: Store }>(`${this.apiUrl}`, store);
  }

  updateStore(id: number, store: Store): Observable<{ success: boolean; data: Store }> {
    return this.http.put<{ success: boolean; data: Store }>(`${this.apiUrl}/${id}`, store);
  }

  deleteStore(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  addToFavorites(storeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${storeId}/favorites`, {});
  }

  removeFromFavorites(storeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${storeId}/favorites`);
  }

  getFavoriteStores(): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiUrl}/favorites`);
  }

  searchStores(query: string): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiUrl}/search`, {
      params: { query }
    });
  }
} 