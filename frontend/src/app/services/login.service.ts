import {Injectable} from '@angular/core';
import {Login} from "../common/login";
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private httpClient: HttpClientService) {
    }

    login(loginData: Login) {
        let url = 'api/auth/sign-in'
        return this.httpClient.load<any>(HttpMethod.POST, url, false, loginData);
    }
}