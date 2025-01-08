import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = sessionStorage.getItem('token');
    const userRole = this.getUserRoleFromToken(token);

    if (token && userRole === 'admin') {
      return true; // Allow access for admin role
    } else {
      this.router.navigate(['/login']); // Redirect to login for non-admin users
      return false;
    }
  }

  private getUserRoleFromToken(token: string | null): string | null {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return payload.role; // Assumes the token contains a 'role' field
  }
}
