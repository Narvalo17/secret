import { Component, OnInit, OnDestroy, HostListener, HostBinding } from '@angular/core';
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
  isStoreOwner = false;
  cartItemCount = 0;
  private cartSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined;
  lastScrollTop = 0;
  isScrolled = false;
  
  @HostBinding('class.store-owner') 
  get isOwner() { 
    return this.isStoreOwner; 
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    // Vérification directe du localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('📦 Utilisateur stocké dans localStorage:', user);
      console.log('👤 Rôle stocké:', user.role);
    } else {
      console.log('❌ Aucun utilisateur dans localStorage');
    }
  }

  ngOnInit(): void {
    // Souscrire aux changements d'utilisateur
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isStoreOwner = user?.role === 'STORE_OWNER';
      
      // Journalisation limitée pour éviter de spammer la console
      console.log('👤 Utilisateur connecté, rôle:', user?.role);
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