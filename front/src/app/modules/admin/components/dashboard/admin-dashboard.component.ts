import { Component, OnInit } from '@angular/core';
import { StatisticsService, DashboardStatistics } from '@core/services/statistics.service';
import { StoreService } from '@core/services/store.service';
import { ProductService } from '@core/services/product.service';
import { NotificationService } from '@core/services/notification.service';

interface LoadingState {
  statistics: boolean;
  stores: boolean;
  products: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  statistics: DashboardStatistics = {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalStores: 0,
    recentOrders: [],
    topProducts: []
  };
  loading: LoadingState = {
    statistics: true,
    stores: false,
    products: false
  };
  error = false;

  recentStores: any[] = [];
  recentProducts: any[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private storeService: StoreService,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.loading.statistics = true;
    this.statisticsService.getDashboardStatistics().subscribe({
      next: (data: DashboardStatistics) => {
        this.statistics = data;
        this.loading.statistics = false;
      },
      error: (error: Error) => {
        console.error('Error loading statistics:', error);
        this.error = true;
        this.loading.statistics = false;
        this.notificationService.error('Erreur lors du chargement des statistiques');
      }
    });
  }

  private loadRecentStores(): void {
    this.loading.stores = true;
    this.storeService.getAllStores().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentStores = response.data.slice(0, 5);
          this.statistics.totalStores = response.data.length;
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des magasins récents');
        console.error('Error loading recent stores:', error);
      },
      complete: () => {
        this.loading.stores = false;
      }
    });
  }

  private loadRecentProducts(): void {
    this.loading.products = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.recentProducts = products.slice(0, 5);
        this.statistics.totalProducts = products.length;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des produits récents');
        console.error('Error loading recent products:', error);
      },
      complete: () => {
        this.loading.products = false;
      }
    });
  }

  refreshData(): void {
    this.loadStatistics();
    this.notificationService.success('Données du tableau de bord mises à jour');
  }
} 