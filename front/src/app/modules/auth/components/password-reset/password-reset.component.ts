import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  step: 'request' | 'reset' = 'request';
  requestForm: FormGroup;
  resetForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      token: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onRequestSubmit() {
    if (this.requestForm.valid && !this.loading) {
      this.loading = true;
      const email = this.requestForm.get('email')?.value;
      
      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.notificationService.success('Un email de réinitialisation a été envoyé à votre adresse');
          this.step = 'reset';
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
          this.loading = false;
        }
      });
    }
  }

  onResetSubmit() {
    if (this.resetForm.valid && !this.loading) {
      this.loading = true;
      const { token, password } = this.resetForm.value;
      
      this.authService.resetPassword(token, password).subscribe({
        next: () => {
          this.notificationService.success('Votre mot de passe a été réinitialisé avec succès');
          this.router.navigate(['/auth/login']);
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la réinitialisation du mot de passe');
          this.loading = false;
        }
      });
    }
  }
} 