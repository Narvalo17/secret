import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
    SharedModule,
    StoresRoutingModule
  ],
  providers: [
    StoreService,
    ProductService
  ]
})
export class StoresModule { } 