import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoresRoutingModule } from './stores-routing.module';
import { StoresListComponent } from './components/stores-list/stores-list.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';
import { StoreService } from '@core/services/store.service';
import { ProductService } from '@core/services/product.service';

@NgModule({
  declarations: [
    StoresListComponent,
    StoreDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StoresRoutingModule
  ],
  providers: [
    StoreService,
    ProductService
  ]
})
export class StoresModule { } 