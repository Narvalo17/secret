import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from '@core/models/cart.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isUserMenuOpen = false;
  isLoggedIn = false;
  cartItemCount = 0;
  private cartSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined;
  lastScrollTop = 0;
  isScrolled = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.cartSubscription = this.cartService.getCart().subscribe((cart: Cart) => {
      this.cartItemCount = cart.items.reduce((count: number, item) => count + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop) {
      // Scroll vers le bas
      this.isScrolled = true;
    } else {
      // Scroll vers le haut
      this.isScrolled = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigate(['/auth/login']);
  }
} 