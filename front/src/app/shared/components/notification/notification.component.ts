import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification" *ngIf="message">
      <div class="notification-content" [ngClass]="type">
        <i class="fas" [ngClass]="getIcon()"></i>
        <span>{{ message }}</span>
        <button class="close-btn" (click)="close()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      min-width: 300px;
    }

    .notification-content {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      margin-bottom: 0.5rem;
      animation: slideIn 0.3s ease-out;
    }

    .success {
      background-color: #4caf50;
      color: white;
    }

    .error {
      background-color: #f44336;
      color: white;
    }

    .warning {
      background-color: #ff9800;
      color: white;
    }

    .info {
      background-color: #2196f3;
      color: white;
    }

    i {
      margin-right: 0.8rem;
      font-size: 1.2rem;
    }

    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.2rem;
      opacity: 0.8;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string = '';
  type: 'success' | 'error' | 'warning' | 'info' = 'info';
  private subscription: Subscription;

  constructor(private notificationService: NotificationService) {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;
      setTimeout(() => this.close(), 5000);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getIcon(): string {
    switch (this.type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-exclamation-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-info-circle';
    }
  }

  close(): void {
    this.message = '';
  }
} 
