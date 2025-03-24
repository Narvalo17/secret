import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  loading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.loading = true;
      const { email } = this.resetForm.value;

      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.emailSent = true;
          this.notificationService.success('Instructions envoyées par email');
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 3000);
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la réinitialisation du mot de passe');
          this.loading = false;
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/admin/login']);
  }
} 