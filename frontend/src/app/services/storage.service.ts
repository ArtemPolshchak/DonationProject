import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../enums/app-constans';
import {User} from "../common/user";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getUser(): User | undefined {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      return new User(tokenInfo.id, tokenInfo.sub, tokenInfo.email, tokenInfo.role)
    }
    return undefined;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return "Can't decode token";
    }
  }
}
