import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AdminGuard } from '@core/guards/admin.guard';

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
      }
    ]
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    StoreManagementComponent,
    ProductManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminModule { } 