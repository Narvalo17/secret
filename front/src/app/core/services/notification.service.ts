import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new Subject<Notification>();

  constructor() {}

  getNotifications() {
    return this.notifications.asObservable();
  }

  success(message: string) {
    this.notifications.next({ message, type: 'success' });
  }

  error(message: string) {
    this.notifications.next({ message, type: 'error' });
  }

  warning(message: string) {
    this.notifications.next({ message, type: 'warning' });
  }

  info(message: string) {
    this.notifications.next({ message, type: 'info' });
  }
} 