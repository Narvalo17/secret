import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';
import { User } from '@core/services/auth.service';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'role', 'actions'];
  dataSource: MatTableDataSource<User>;
  loading = false;
  error = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { user, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.adminService.deleteUser(user.id!).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
          console.error('Erreur:', err);
        }
      });
    }
  }

  updateRole(user: User, newRole: string) {
    this.adminService.updateUserRole(user.id!, newRole).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du rôle';
        console.error('Erreur:', err);
      }
    });
  }
} 