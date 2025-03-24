import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '@shared/shared.module';
import { StoresRoutingModule } from './stores-routing.module';
import { StoresListComponent } from './components/stores-list/stores-list.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';
import { StoreService } from '@core/services/store.service';
import { ProductService } from '@core/services/product.service';

const routes: Routes = [
  {
    path: '',
    component: StoresListComponent
  },
  {
    path: ':id',
    component: StoreDetailComponent
  }
];

@NgModule({
  declarations: [
    StoresListComponent,
    StoreDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedModule,
    StoresRoutingModule
  ],
  providers: [
    StoreService,
    ProductService
  ],
  exports: [
    StoresListComponent,
    StoreDetailComponent
  ]
})
export class StoresModule { } 