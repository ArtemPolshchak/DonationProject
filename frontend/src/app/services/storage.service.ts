import {Injectable} from '@angular/core';
import {TOKEN_KEY} from '../enums/app-constans';
import {User} from "../common/user";
import {jwtDecode} from "jwt-decode";

@Injectable({
    providedIn: 'root'
})
export abstract class StorageService {

    static storage: Storage = localStorage;

    static saveToken(token: string) {
        this.storage.removeItem(TOKEN_KEY);
        this.storage.setItem(TOKEN_KEY, token);
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
        const currentTime = Math.floor(Date.now() / 1000);
        return !(tokenInfo.exp <= currentTime || tokenInfo.iat > currentTime);
    }

    static getItem(key: string): string | null {
        return this.storage.getItem(key);
    }

    static removeItem(key: string) {
        this.storage.removeItem(key);
    }
}
