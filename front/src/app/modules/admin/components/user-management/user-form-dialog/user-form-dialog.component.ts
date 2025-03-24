import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../../services/admin.service';
import { User } from '@core/services/auth.service';

interface DialogData {
  user: User;
  mode: 'edit' | 'create';
}

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent {
  userForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.userForm = this.fb.group({
      firstName: [data.user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [data.user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [data.user.email, [Validators.required, Validators.email]],
      phoneNumber: [data.user.phoneNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      role: [data.user.role, Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      this.error = '';

      const userData = this.userForm.value;
      
      this.adminService.updateUser(this.data.user.id!, userData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.error = err.error?.message || 'Une erreur est survenue lors de la mise à jour';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 