import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.role === 'MERCHANT') {
      return true;
    }

    this.notificationService.error('Accès réservé aux commerçants');
    this.router.navigate(['/']);
    return false;
  }
} 