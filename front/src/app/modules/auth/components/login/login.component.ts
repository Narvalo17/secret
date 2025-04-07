import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  redirectUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Récupérer l'URL de redirection s'il existe
    this.redirectUrl = localStorage.getItem('redirectAfterLogin');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          // Rediriger vers l'URL sauvegardée ou la page d'accueil
          const redirectTo = this.redirectUrl || '/';
          localStorage.removeItem('redirectAfterLogin'); // Nettoyer l'URL de redirection
          this.router.navigate([redirectTo]);
        },
        error: (err) => {
          this.error = err.error?.message || 'Une erreur est survenue lors de la connexion';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 