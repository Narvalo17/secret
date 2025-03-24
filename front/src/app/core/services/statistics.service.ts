import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  storeId?: number;
}

export interface Statistics {
  totalSales: number;
  totalProducts: number;
  activeStores: number;
  newCustomers: number;
  salesData: {
    date: string;
    amount: number;
  }[];
  productData: {
    category: string;
    quantity: number;
  }[];
}

export interface DashboardStatistics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalStores: number;
  recentOrders: any[];
  topProducts: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/admin/statistic`;

  constructor(private http: HttpClient) {}

  getAllStatistics(filters?: StatisticsFilters): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/all`, { params: { ...filters } });
  }

  exportStatistics(filters?: StatisticsFilters): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: { ...filters },
      responseType: 'blob'
    });
  }

  getDashboardStatistics(): Observable<DashboardStatistics> {
    // Mock data for now
    return of({
      totalSales: 150000,
      totalOrders: 250,
      totalCustomers: 120,
      totalProducts: 45,
      totalStores: 8,
      recentOrders: [],
      topProducts: []
    });
  }
} 