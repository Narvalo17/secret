import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  step = 1; // 1: email form, 2: new password form
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      if (this.step === 1) {
        console.log('📝 Étape 1: Vérification de l\'email');
        const email = this.resetForm.get('email')?.value;
        console.log('📧 Email soumis:', email);
        
        this.authService.requestPasswordReset(email).subscribe({
          next: (response) => {
            console.log('✅ Email vérifié avec succès:', response);
            this.userId = response.id;
            this.success = 'Email vérifié. Veuillez entrer votre nouveau mot de passe.';
            this.step = 2;
            this.loading = false;
          },
          error: (err) => {
            console.error('❌ Erreur lors de la vérification de l\'email:', err);
            this.error = err.error?.message || 'Utilisateur non trouvé';
            this.loading = false;
          }
        });
      } else {
        console.log('📝 Étape 2: Réinitialisation du mot de passe');
        if (!this.userId) {
          console.error('❌ Erreur: ID utilisateur manquant');
          this.error = 'Une erreur est survenue. Veuillez recommencer.';
          this.loading = false;
          return;
        }

        console.log('👤 ID utilisateur:', this.userId);
        const newPassword = this.resetForm.get('newPassword')?.value;
        
        this.authService.resetPassword(this.userId, newPassword).subscribe({
          next: () => {
            console.log('✅ Mot de passe réinitialisé avec succès');
            this.success = 'Votre mot de passe a été réinitialisé avec succès.';
            setTimeout(() => {
              console.log('🔄 Redirection vers la page de connexion...');
              this.router.navigate(['/auth/login']);
            }, 2000);
          },
          error: (err) => {
            console.error('❌ Erreur lors de la réinitialisation du mot de passe:', err);
            this.error = err.error?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe';
            this.loading = false;
          }
        });
      }
    } else {
      console.warn('⚠️ Formulaire invalide:', this.resetForm.errors);
    }
  }
} 