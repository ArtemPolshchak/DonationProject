import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Login} from "../common/login";
import {Router} from "@angular/router";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    constructor(
      private httpClient: HttpClient,
      private router: Router,
      private storageService: StorageService) {
  }

    login(loginData: Login): Observable<any> {
        return this.httpClient.post<any>('api/auth/sign-in', loginData).pipe(
            tap(response => {
                this.storageService.saveToken(response.token);
                const redirect = this.storageService.getUser()?.role
                this.redirectBasedOnRole(redirect);
            })
        );
    }
    private redirectBasedOnRole(role: string | undefined): void {
        switch (role) {
            case 'ADMIN':
                this.router.navigateByUrl('/dashboard');
                break;
            case 'MODERATOR':
                this.router.navigateByUrl('/donations');
                break;
            default:
                this.router.navigateByUrl('/app-guest-page');
                break;
        }
    }
}