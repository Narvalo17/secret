import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatisticsService } from '@core/services/statistics.service';
import { NotificationService } from '@core/services/notification.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  loading = false;
  statistics: any = null;
  filterForm: FormGroup;
  salesChart: Chart | null = null;
  productsChart: Chart | null = null;

  constructor(
    private statisticsService: StatisticsService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      storeId: ['']
    });
  }

  ngOnInit(): void {
    this.loadStatistics();
    this.filterForm.valueChanges.subscribe(() => {
      this.loadStatistics();
    });
  }

  private loadStatistics(): void {
    this.loading = true;
    this.statisticsService.getAllStatistics(this.filterForm.value).subscribe({
      next: (data) => {
        this.statistics = data;
        this.updateCharts();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des statistiques');
        this.loading = false;
      }
    });
  }

  private updateCharts(): void {
    if (this.statistics) {
      this.updateSalesChart();
      this.updateProductsChart();
    }
  }

  private updateSalesChart(): void {
    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.statistics.salesData.map((item: any) => item.date),
        datasets: [{
          label: 'Ventes',
          data: this.statistics.salesData.map((item: any) => item.amount),
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Évolution des ventes'
          }
        }
      }
    });
  }

  private updateProductsChart(): void {
    if (this.productsChart) {
      this.productsChart.destroy();
    }

    const ctx = document.getElementById('productsChart') as HTMLCanvasElement;
    this.productsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.statistics.productData.map((item: any) => item.category),
        datasets: [{
          label: 'Produits vendus',
          data: this.statistics.productData.map((item: any) => item.quantity),
          backgroundColor: '#2196F3'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Ventes par catégorie'
          }
        }
      }
    });
  }

  exportData(): void {
    // TODO: Implémenter l'export des données
    this.notificationService.info('Export des données en cours de développement');
  }
} 