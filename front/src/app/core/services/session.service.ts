import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { User } from '@core/models/user.model';

interface SessionInfo {
  token: string;
  expiresAt: number;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly SESSION_INFO_KEY = 'session_info';
  
  private sessionTimeout: any;
  private readonly sessionTimeoutWarning = 5 * 60 * 1000; // 5 minutes avant expiration
  private sessionExpirySubject = new BehaviorSubject<number | null>(null);
  
  constructor() {
    this.initializeSession();
  }

  private initializeSession(): void {
    const sessionInfo = this.getSessionInfo();
    if (sessionInfo) {
      this.setupExpirationTimer(sessionInfo.expiresAt);
    }
  }

  setSession(token: string, refreshToken: string, expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000;
    
    const sessionInfo: SessionInfo = {
      token,
      refreshToken,
      expiresAt
    };

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.SESSION_INFO_KEY, JSON.stringify(sessionInfo));

    this.setupExpirationTimer(expiresAt);
  }

  private setupExpirationTimer(expiresAt: number): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    const timeUntilExpiry = expiresAt - Date.now();
    const timeUntilWarning = timeUntilExpiry - this.sessionTimeoutWarning;

    if (timeUntilWarning > 0) {
      this.sessionTimeout = setTimeout(() => {
        this.sessionExpirySubject.next(expiresAt);
      }, timeUntilWarning);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private getSessionInfo(): SessionInfo | null {
    const info = localStorage.getItem(this.SESSION_INFO_KEY);
    return info ? JSON.parse(info) : null;
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.SESSION_INFO_KEY);
    
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    
    this.sessionExpirySubject.next(null);
  }

  isSessionValid(): boolean {
    const sessionInfo = this.getSessionInfo();
    if (!sessionInfo) return false;
    
    return Date.now() < sessionInfo.expiresAt;
  }

  getSessionExpiryWarning(): Observable<number | null> {
    return this.sessionExpirySubject.asObservable();
  }

  getRemainingTime(): number {
    const sessionInfo = this.getSessionInfo();
    if (!sessionInfo) return 0;
    
    return Math.max(0, sessionInfo.expiresAt - Date.now());
  }

  refreshSession(newToken: string, newRefreshToken: string, expiresIn: number): void {
    this.setSession(newToken, newRefreshToken, expiresIn);
  }
} 