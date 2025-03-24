import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '@shared/shared.module';

import { StoreManagementComponent } from './store-management.component';
import { StoreFormComponent } from './store-form/store-form.component';

@NgModule({
  declarations: [
    StoreManagementComponent,
    StoreFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  exports: [
    StoreManagementComponent
  ]
})
export class StoreManagementModule { } 