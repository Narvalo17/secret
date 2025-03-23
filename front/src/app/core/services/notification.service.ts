import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  show(notification: Notification) {
    this.notificationSubject.next({
      duration: 3000,
      ...notification
    });
  }

  success(message: string, duration = 3000) {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration = 3000) {
    this.show({ message, type: 'error', duration });
  }

  info(message: string, duration = 3000) {
    this.show({ message, type: 'info', duration });
  }
} 