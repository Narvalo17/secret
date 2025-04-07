import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoresListComponent } from './components/stores-list/stores-list.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: StoresListComponent,
    data: { mode: 'customer' }
  },
  {
    path: 'merchant',
    component: StoresListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      mode: 'merchant',
      roles: ['MERCHANT']
    }
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