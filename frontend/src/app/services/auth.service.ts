import {inject, Injectable, OnInit} from '@angular/core';
import {StorageService} from "./storage.service";
import {Role} from "../enums/app-constans";
import {CanActivateFn, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private userRole?: Role;
  constructor(private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.userRole = this.getUserRole()
  }

  getUserRole(): Role | undefined {
     return this.storageService.getUser()?.role
  }

  isAdmin(): boolean {
    return Role.ADMIN === this.getUserRole();
  }

  isModerator(): boolean {
    return Role.MODERATOR === this.getUserRole();
  }

  isGuest(): boolean {
    return Role.GUEST === this.getUserRole();
  }

  isLoggedIn(): boolean {
    return this.storageService.getUser() !== undefined;
  }
}

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userRole: Role | undefined = inject(AuthService).getUserRole();
  const expectedRoles: Role[] = route.data['roles'];

  const hasRole: boolean = expectedRoles.some((role) => userRole === role);

  return hasRole || router.navigate(['login']);
};