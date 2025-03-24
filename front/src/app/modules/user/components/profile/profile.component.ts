import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserService, UserUpdate } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phone: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement du profil');
        this.loading = false;
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      const userData: UserUpdate = this.profileForm.value;
      
      this.userService.updateUser(this.user!.id, userData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.notificationService.success('Profil mis à jour avec succès');
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la mise à jour du profil');
          this.loading = false;
        }
      });
    }
  }

  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.userService.updatePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.notificationService.success('Mot de passe mis à jour avec succès');
          this.passwordForm.reset();
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la mise à jour du mot de passe');
          this.loading = false;
        }
      });
    }
  }

  private passwordMatchValidator(g: FormGroup): null | { mismatch: boolean } {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
} 