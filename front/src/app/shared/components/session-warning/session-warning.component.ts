import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '@core/services/session.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-session-warning',
  templateUrl: './session-warning.component.html',
  styleUrls: ['./session-warning.component.scss']
})
export class SessionWarningComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  showWarning = false;
  remainingTime = 0;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.sessionService.getSessionExpiryWarning().subscribe(expiryTime => {
        if (expiryTime) {
          this.showWarning = true;
          this.remainingTime = Math.floor((expiryTime - Date.now()) / 1000 / 60); // Minutes
        } else {
          this.showWarning = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onExtendSession(): void {
    const refreshToken = this.sessionService.getRefreshToken();
    if (refreshToken) {
      this.authService.refreshToken(refreshToken).subscribe({
        next: () => {
          this.showWarning = false;
          this.notificationService.success('Session prolongée avec succès');
        },
        error: () => {
          this.notificationService.error('Erreur lors de la prolongation de la session');
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
} 