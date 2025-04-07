import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';

const routes: Routes = [
  {
    path: 'store-products',
    loadChildren: () => import('./components/store-products/store-products.module').then(m => m.StoreProductsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STORE_OWNER'] }
  },
  {
    path: 'my-store',
    loadChildren: () => import('./components/my-store/my-store.module').then(m => m.MyStoreModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STORE_OWNER'] }
  },
  {
    path: 'store-orders',
    loadChildren: () => import('./components/store-orders/store-orders.module').then(m => m.StoreOrdersModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['STORE_OWNER'] }
  },
  // Redirection par défaut
  {
    path: '',
    redirectTo: 'my-store',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MerchantModule { } 