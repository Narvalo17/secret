import { Component, OnInit, OnDestroy, HostListener, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CartService } from '@core/services/cart.service';
import { ShoppingCartService } from '@core/services/shopping-cart.service';
import { Subscription, interval } from 'rxjs';
import { Cart } from '@core/models/cart.model';
import { switchMap } from 'rxjs/operators';

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
  private cartCountSubscription: Subscription | undefined;
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
    private cartService: CartService,
    private shoppingCartService: ShoppingCartService
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
      
      // Charger le panier si l'utilisateur est connecté
      if (this.isLoggedIn && !this.isStoreOwner) {
        this.loadShoppingCart();
        
        // S'abonner au compteur d'articles en temps réel
        this.subscribeToCartUpdates();
      } else {
        // Réinitialiser le compteur si l'utilisateur est déconnecté
        this.cartItemCount = 0;
      }
    });

    // S'abonner aux mises à jour du panier local également (pour la compatibilité)
    this.cartService.getCart().subscribe((cart: Cart) => {
      // Utiliser le nombre d'articles du ShoppingCart en priorité
      if (this.cartItemCount === 0) {
        this.cartItemCount = cart.items.reduce((count: number, item) => count + item.quantity, 0);
      }
    });
    
    // Vérifier les mises à jour du panier toutes les 60 secondes (pour les mises à jour côté serveur)
    if (!this.isStoreOwner) {
      this.cartSubscription = interval(60000).pipe(
        switchMap(() => {
          if (this.isLoggedIn) {
            return this.shoppingCartService.getShoppingCart();
          }
          return [];
        })
      ).subscribe();
    }
  }
  
  private subscribeToCartUpdates(): void {
    // S'abonner au compteur d'articles du panier
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
    
    this.cartCountSubscription = this.shoppingCartService.getCartItemCount()
      .subscribe(count => {
        console.log('🔄 Mise à jour du compteur du panier:', count);
        this.cartItemCount = count;
      });
  }

  loadShoppingCart(): void {
    if (!this.isLoggedIn) return;
    
    this.shoppingCartService.getShoppingCart().subscribe({
      next: (cart) => {
        console.log('🛒 Panier chargé dans NavbarComponent');
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement du panier:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
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