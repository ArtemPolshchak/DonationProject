import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Login} from "../common/login";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'http://localhost:5000/api/auth/sign-in';

  constructor(private httpClient: HttpClient, private router: Router) { // Внедрюємо Router
  }

  login(loginData: Login): Observable<any> {
    return this.httpClient.post<any>(this.loginUrl, loginData).pipe(
        tap(response => {
          // Зберегти токен та інформацію користувача у Session Storage
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', JSON.stringify(response.user));

          // Перенаправлення на сторінку dashboard
          this.router.navigateByUrl('/dashboard');
        })
    );
  }
}