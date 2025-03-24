import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '@core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications" 
           class="notification" 
           [class.success]="notification.type === 'success'"
           [class.error]="notification.type === 'error'"
           [class.warning]="notification.type === 'warning'"
           [class.info]="notification.type === 'info'">
        <i class="fas" [class.fa-check-circle]="notification.type === 'success'"
                    [class.fa-exclamation-circle]="notification.type === 'error'"
                    [class.fa-exclamation-triangle]="notification.type === 'warning'"
                    [class.fa-info-circle]="notification.type === 'info'"></i>
        <span>{{ notification.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }

    .notification {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px 25px;
      margin-bottom: 10px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;

      &.success {
        background: #2ecc71;
        color: white;
      }

      &.error {
        background: #e74c3c;
        color: white;
      }

      &.warning {
        background: #f1c40f;
        color: white;
      }

      &.info {
        background: #3498db;
        color: white;
      }

      i {
        font-size: 1.2rem;
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
  notifications: Notification[] = [];
  private subscription: Subscription | undefined;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications().subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
} 
