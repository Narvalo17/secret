import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, StoreResponse, CreateStoreDto } from '@core/models/store.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(this.apiUrl);
  }

  getStoreById(id: number): Observable<{ success: boolean; message: string; data?: Store }> {
    return this.http.get<{ success: boolean; message: string; data?: Store }>(`${this.apiUrl}/${id}`);
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