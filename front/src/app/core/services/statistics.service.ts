import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoreStatistics {
  totalSales: number;
  averageOrderValue: number;
  topProducts: {
    productId: number;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  salesByPeriod: {
    period: string;
    sales: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly apiUrl = 'api/admin/statistic';

  constructor(private http: HttpClient) { }

  getAllStatistics(): Observable<StoreStatistics[]> {
    return this.http.get<StoreStatistics[]>(`${this.apiUrl}/all`);
  }

  getStoreStatistics(storeId: number): Observable<StoreStatistics> {
    return this.http.get<StoreStatistics>(`${this.apiUrl}/store/${storeId}`);
  }

  getStatisticsByDateRange(startDate: Date, endDate: Date): Observable<StoreStatistics[]> {
    return this.http.get<StoreStatistics[]>(`${this.apiUrl}/range`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }
} 