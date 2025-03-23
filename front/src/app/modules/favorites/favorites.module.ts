import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteStoresComponent } from './components/favorite-stores/favorite-stores.component';
import { FavoritesRoutingModule } from './favorites-routing.module';

@NgModule({
  declarations: [
    FavoriteStoresComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FavoritesRoutingModule
  ]
})
export class FavoritesModule { } 