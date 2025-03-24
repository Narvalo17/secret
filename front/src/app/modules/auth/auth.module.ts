import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from '../admin/components/login/login.component';
import { RegisterComponent } from '../admin/components/register/register.component';
import { PasswordResetComponent } from '../admin/components/password-reset/password-reset.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent
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
    BrowserAnimationsModule,
    SharedModule
  ]
})
export class AuthModule { } 