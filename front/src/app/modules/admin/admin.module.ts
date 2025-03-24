import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '@shared/shared.module';

import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AdminGuard } from '@core/guards/admin.guard';
import { StoreManagementModule } from './components/store-management/store-management.module';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
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
  declarations: [
    AdminDashboardComponent,
    ProductManagementComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    SharedModule,
    StoreManagementModule
  ]
})
export class AdminModule { } 