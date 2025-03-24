import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = false;
  adminName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.adminName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
  }

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 