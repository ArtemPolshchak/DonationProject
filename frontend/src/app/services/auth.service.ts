import {inject, Injectable, OnInit} from '@angular/core';
import {StorageService} from "./storage.service";
import {Role} from "../enums/role";
import {CanActivateFn, Router} from "@angular/router";
import {Login} from "../common/login";
import {HttpMethod} from "../enums/http-method";
import {HttpClientService} from "./http-client.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit {
    private userRole?: Role;

    constructor(
        private httpClient: HttpClientService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.userRole = this.getUserRole()
    }

    login(loginData: Login) {
        let url = 'api/auth/login'
        return this.httpClient.load<LoginResponseDto | undefined>(HttpMethod.POST, url, false, loginData);
    }

    verifyTotp(dto: TotpRequestDto) {
        let url = 'api/auth/totp'
        return this.httpClient.load<any>(HttpMethod.POST, url, false, dto);
    }

    getUserRole(): Role | undefined {
        return StorageService.getUser()?.role
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
        return StorageService.getUser() !== undefined;
    }

    redirectBasedOnRole(): void {
        switch (StorageService.getUser()?.role) {
            case 'ADMIN':
                this.router.navigateByUrl('/dashboard');
                break;
            case 'MODERATOR':
                this.router.navigateByUrl('/donations');
                break;
            default:
                this.router.navigateByUrl('/app-guest-page');
        }
    }
}

interface LoginResponseDto {
    qrCode: string;
}

interface TotpRequestDto {
    code: any;
    username: any;
}

export const hasRoleGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const userRole: Role | undefined = inject(AuthService).getUserRole();
    const expectedRoles: Role[] = route.data['roles'];
    const hasRole: boolean = expectedRoles.some((role) => userRole === role);
    return hasRole || router.navigate(['login']);
};
