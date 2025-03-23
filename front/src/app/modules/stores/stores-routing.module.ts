import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoresListComponent } from './components/stores-list/stores-list.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';

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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule { } 