import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    if (!requiredRoles || !userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // Si l'utilisateur n'a pas le rôle requis, rediriger vers la page d'accueil
    this.router.navigate(['/']);
    return false;
  }
} 