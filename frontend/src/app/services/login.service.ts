import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Login} from "../common/login";
import {StorageService} from "./storage.service";
import {ServerService} from "./server.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private httpClient: HttpClient,
        private serverService: ServerService) {
    }

    async login(loginData: Login) {
        return this.httpClient.post<any>('api/auth/sign-in', loginData).pipe(
            tap(response => {
                StorageService.saveToken(response.token);
                this.getServerList()
            })
        );
    }

    private getServerList() {
        sessionStorage.removeItem('servers');
        this.serverService.getAllServerNames().subscribe({
            next: (v) => {
                StorageService.add('servers', JSON.stringify(v.content));
            },
            error: (e) => console.error(e),
        });
    }
}