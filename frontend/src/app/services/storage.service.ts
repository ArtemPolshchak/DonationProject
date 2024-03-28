import {Injectable} from '@angular/core';
import {SERVERS_KEY, TOKEN_KEY} from '../enums/app-constans';
import {User} from "../common/user";
import {jwtDecode} from "jwt-decode";
import {Subject} from 'rxjs';
import {Server} from "../common/server";

@Injectable({
    providedIn: 'root'
})
export abstract class StorageService {

    static storage: Storage = localStorage;

    static serversSub = new Subject<Server[]>();
    static tokenSub = new Subject<string>();

    static addToken(token: string) {
        this.storage.setItem(TOKEN_KEY, token);
        this.tokenSub.next(token);
    }

    static addServers(servers: string) {
        this.storage.setItem(SERVERS_KEY, servers);
        this.serversSub.next(JSON.parse(servers));
    }

    static addItem(key: string, value: string): void {
        this.storage.setItem(key, value);
    }

    static getToken(): string | undefined {
        let token = this.storage.getItem(TOKEN_KEY);
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

    static getServers() {
        const serversData = this.storage.getItem(SERVERS_KEY);
        return serversData ? JSON.parse(this.storage.getItem(SERVERS_KEY)!) : serversData;
    }

    static watchServers() {
        return this.serversSub.asObservable();
    }

    static watchToken() {
        return this.tokenSub.asObservable();
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
        if (!tokenInfo.exp && !tokenInfo.iat) {
            return false;
        }
        const date = new Date(Date.now())
        const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(),
            date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
        const currentUTCTime = Math.floor(dateUTC / 1000);
        return (tokenInfo.exp > currentUTCTime && tokenInfo.iat < currentUTCTime);
    }

    static getItem(key: string): string | null {
        return this.storage.getItem(key);
    }

    static removeItem(key: string) {
        this.storage.removeItem(key);
    }
}
