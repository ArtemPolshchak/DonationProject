import { Injectable } from '@angular/core';
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
            this.storageService.saveToken(response.token)
          this.router.navigateByUrl('/dashboard');
        })
    );
  }
}