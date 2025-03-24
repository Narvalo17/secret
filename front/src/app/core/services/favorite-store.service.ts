import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../models/store.model';

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
  private readonly apiUrl = 'api/favorite-store';

  constructor(private http: HttpClient) { }

  getFavoriteStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}/favorite-stores`);
  }

  addToFavorites(storeId: number): Observable<void> {
    return this.http.post<void>(this.apiUrl, { storeId });
  }

  removeFromFavorites(storeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${storeId}`);
  }

  getFilteredStores(filters: FavoriteStoreFilter): Observable<Store[]> {
    return this.http.post<Store[]>(`${this.apiUrl}/filters`, filters);
  }
} 