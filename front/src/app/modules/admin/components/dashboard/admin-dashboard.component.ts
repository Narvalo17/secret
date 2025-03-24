import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

interface DashboardStatistics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Array<{
    id: number;
    customerName: string;
    date: Date;
    amount: number;
    status: string;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    stock: number;
    price: number;
  }>;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  statistics: DashboardStatistics = {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  };
  loading = {
    statistics: false
  };
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.statistics = true;
    this.error = null;

    // Simuler le chargement des données pour le moment
    setTimeout(() => {
      this.statistics = {
        totalSales: 15000,
        totalOrders: 150,
        totalCustomers: 100,
        totalProducts: 50,
        recentOrders: [
          {
            id: 1,
            customerName: 'John Doe',
            date: new Date(),
            amount: 150,
            status: 'Completed'
          }
        ],
        topProducts: [
          {
            name: 'Product 1',
            sales: 100,
            stock: 50,
            price: 99.99
          }
        ]
      };
      this.loading.statistics = false;
    }, 1000);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
} 