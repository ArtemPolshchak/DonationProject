import {Injectable} from '@angular/core';
import {TOKEN_KEY} from '../enums/app-constans';
import {User} from "../common/user";
import {jwtDecode} from "jwt-decode";
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export abstract class StorageService {

    static storage: Storage = localStorage;
    static storageSub= new Subject<string>();

   static watchStorage(): Observable<any> {
        return this.storageSub.asObservable();
    }
    static saveToken(token: string) {
        this.storage.removeItem(TOKEN_KEY);
        this.storage.setItem(TOKEN_KEY, token);
        this.storageSub.next(token);
    }

    static addItem(key: string, value: string): void {
        this.storage.setItem(key, value);
    }

    static getToken(): string | undefined {
        const token = this.storage.getItem(TOKEN_KEY);
        if (token) {
            const tokenInfo = this.getDecodedAccessToken(token);
            if (tokenInfo && this.isTokenValid(tokenInfo)) {
                return token;
            } else {
                this.clear();
            }
        }
        return undefined;
    }

    static clear() {
        this.storage.clear();
    }

    static getUser(): User | undefined {
        const token = this.getToken();
        if (token) {
            const tokenInfo = this.getDecodedAccessToken(token);
            return new User(tokenInfo.id, tokenInfo.sub, tokenInfo.email, tokenInfo.role);
        }
        return undefined;
    }

    static getDecodedAccessToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (Error) {
            console.error("Can't decode token", Error);
            return null;
        }
    }

    static isTokenValid(tokenInfo: any): boolean {
        if (!tokenInfo || !tokenInfo.exp || !tokenInfo.iat) {
            return false;
        }
        const date = new Date(Date.now())
        const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(),
            date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
        const currentUTCTime = Math.floor(dateUTC / 1000);
        return !(tokenInfo.exp <= currentUTCTime || tokenInfo.iat > currentUTCTime);
    }

    static getItem(key: string): string | null {
        return this.storage.getItem(key);
    }

    static removeItem(key: string) {
        this.storage.removeItem(key);
    }
}
