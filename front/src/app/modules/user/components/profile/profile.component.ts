import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      currentPassword: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.userService.getUserById(currentUser.id).subscribe({
        next: (user) => {
          this.user = user;
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors du chargement du profil:', error);
          this.error = error.error?.message || 'Erreur lors du chargement du profil';
        }
      });
    }
  }

  onEdit(): void {
    this.isEditing = true;
    this.error = null;
  }

  onCancel(): void {
    this.isEditing = false;
    if (this.user) {
      this.profileForm.patchValue(this.user);
    }
    this.error = null;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const userId = this.authService.getCurrentUser()?.id;

      if (!userId) {
        this.error = 'Utilisateur non trouvé';
        return;
      }

      // Mettre à jour les informations du profil
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.currentPassword || ''
      };

      this.userService.updateUser(userId, updateData).subscribe({
        next: (updatedUser) => {
          this.success = 'Profil mis à jour avec succès';
          this.isEditing = false;
          // Mettre à jour les informations de l'utilisateur dans le service d'authentification
          this.authService.updateCurrentUser(updatedUser);
          // Réinitialiser le champ de mot de passe
          this.profileForm.patchValue({
            currentPassword: ''
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          this.error = 'Erreur lors de la mise à jour du profil: ' + (error.error?.message || error.message);
        }
      });
    }
  }
} 