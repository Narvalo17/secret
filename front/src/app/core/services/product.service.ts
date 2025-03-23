import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/admin/product`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/list`);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}`, product);
  }

  updateProduct(id: number, product: Product): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  getProductsByStore(storeId: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/${storeId}`);
  }

  getProductFilters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/filters`);
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/shopping/add`, { productId, quantity });
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/shopping/${productId}`);
  }
} 