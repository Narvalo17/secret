import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '@core/services/statistics.service';
import { StoreService } from '@core/services/store.service';
import { ProductService } from '@core/services/product.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  loading = {
    stats: false,
    stores: false,
    products: false
  };

  statistics = {
    totalSales: 0,
    totalStores: 0,
    totalProducts: 0,
    averageOrderValue: 0
  };

  recentStores: any[] = [];
  recentProducts: any[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private storeService: StoreService,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loadStatistics();
    this.loadRecentStores();
    this.loadRecentProducts();
  }

  private loadStatistics(): void {
    this.loading.stats = true;
    this.statisticsService.getAllStatistics().subscribe({
      next: (stats) => {
        if (stats && stats.length > 0) {
          const latestStats = stats[0];
          this.statistics.totalSales = latestStats.totalSales;
          this.statistics.averageOrderValue = latestStats.averageOrderValue;
        }
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des statistiques');
        console.error('Error loading statistics:', error);
      },
      complete: () => {
        this.loading.stats = false;
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
    this.loadDashboardData();
    this.notificationService.success('Données du tableau de bord mises à jour');
  }
} 