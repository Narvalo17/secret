import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'stores',
        component: StoreManagementComponent
      },
      {
        path: 'products',
        component: ProductManagementComponent
      },
      {
        path: 'statistics',
        component: StatisticsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { } 