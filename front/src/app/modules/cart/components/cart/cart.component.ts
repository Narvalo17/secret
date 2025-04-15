import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '@core/services/cart.service';
import { Cart, CartItem } from '@core/models/cart.model';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  loading = false;
  showPaymentForm = false;
  paymentForm: FormGroup;
  private cartSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  
  loadCart(): void {
    console.log('🚀 Initialisation du composant de panier');
    this.loading = true;
    this.cartSubscription = this.cartService.getCart().subscribe({
      next: (cart) => {
        console.log('✅ Panier récupéré dans CartComponent:', cart);
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement du panier:', error);
        this.notificationService.error('Erreur lors du chargement du panier');
        this.loading = false;
      }
    });
  }

  updateItemQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }
    
    this.loading = true;
    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: () => {
        console.log('✅ Quantité mise à jour avec succès');
        this.loadCart(); // Recharger le panier pour avoir les données à jour
        this.notificationService.success('Quantité mise à jour');
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de la mise à jour de la quantité:', error);
        this.notificationService.error('Erreur lors de la mise à jour de la quantité');
        this.loading = false;
      }
    });
  }

  removeItem(item: CartItem): void {
    this.loading = true;
    this.cartService.removeFromCart(item.productId).subscribe({
      next: () => {
        console.log('✅ Article supprimé avec succès');
        this.loadCart(); // Recharger le panier pour avoir les données à jour
        this.notificationService.info('Article retiré du panier');
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de la suppression de l\'article:', error);
        this.notificationService.error('Erreur lors de la suppression de l\'article');
        this.loading = false;
      }
    });
  }

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.notificationService.warning('Votre panier est vide');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.notificationService.info('Veuillez vous connecter pour continuer');
      // Sauvegarder l'URL de redirection
      localStorage.setItem('redirectAfterLogin', '/checkout');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Afficher le formulaire de paiement
    this.showPaymentForm = true;
  }
  
  submitPayment(): void {
    if (this.paymentForm.invalid) {
      this.notificationService.error('Veuillez remplir correctement tous les champs du formulaire');
      return;
    }
    
    this.loading = true;
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      this.loading = false;
      this.notificationService.success('Paiement accepté! Votre commande est en cours de traitement');
      
      // Vider le panier après paiement
      this.clearAllItems(false);
      
      // Masquer le formulaire de paiement
      this.showPaymentForm = false;
    }, 1500);
  }
  
  cancelPayment(): void {
    this.showPaymentForm = false;
    this.paymentForm.reset();
  }

  // Méthode pour vider complètement le panier
  clearAllItems(showConfirmation: boolean = true): void {
    const proceed = !showConfirmation || confirm('Êtes-vous sûr de vouloir vider votre panier ?');
    
    if (proceed) {
      this.loading = true;
      this.cartService.clearCart().subscribe({
        next: () => {
          console.log('✅ Panier vidé avec succès');
          // Mise à jour de l'interface
          this.cart = { items: [], total: 0 };
          if (showConfirmation) {
            this.notificationService.success('Votre panier a été vidé');
          }
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Erreur lors du vidage du panier:', error);
          this.notificationService.error('Erreur lors du vidage du panier');
          this.loading = false;
        }
      });
    }
  }
} 