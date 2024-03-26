import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Login} from "../common/login";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private httpClient: HttpClient) {
    }

    login(loginData: Login) {
        return this.httpClient.post<any>('api/auth/sign-in', loginData);
    }
}