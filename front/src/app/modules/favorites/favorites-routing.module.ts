import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoriteStoresComponent } from './components/favorite-stores/favorite-stores.component';

const routes: Routes = [
  {
    path: '',
    component: FavoriteStoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritesRoutingModule { } 