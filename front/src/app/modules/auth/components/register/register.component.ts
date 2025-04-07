import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  storeForm!: FormGroup;
  loading = false;
  error = '';
  isStoreOwner = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      category: ['', [Validators.required]]
    });
  }

  toggleStoreOwner() {
    this.isStoreOwner = !this.isStoreOwner;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid && (!this.isStoreOwner || this.storeForm.valid)) {
      this.loading = true;
      this.error = '';
      
      const formData = this.registerForm.value;
      console.log('📝 Données du formulaire utilisateur:', formData);
      
      const userData: User = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        emailVerified: false,
        role: this.isStoreOwner ? 'STORE_OWNER' : 'USER'
      };
      console.log('👤 Données utilisateur formatées:', userData);

      let storeData = null;
      if (this.isStoreOwner) {
        const storeFormValue = this.storeForm.value;
        console.log('📝 Données du formulaire magasin:', storeFormValue);
        
        storeData = {
          name: storeFormValue.name,
          description: storeFormValue.description,
          address: storeFormValue.address,
          phone: storeFormValue.phone,
          email: storeFormValue.email,
          website: storeFormValue.website || null,
          category: storeFormValue.category,
          isActive: true
        };
        console.log('🏪 Données magasin formatées:', storeData);
      }
      
      this.authService.register(userData, storeData).subscribe({
        next: (response) => {
          console.log('✅ Inscription réussie:', response);
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('❌ Erreur lors de l\'inscription:', err);
          this.error = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 