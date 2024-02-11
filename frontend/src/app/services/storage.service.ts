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
    const token = this.getToken();
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      if (tokenInfo && this.isTokenValid(tokenInfo)) {
        return new User(tokenInfo.id, tokenInfo.sub, tokenInfo.email, tokenInfo.role);
      } else {
        this.signOut();
      }
    }
    return undefined;
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      console.error("Can't decode token", Error);
      return null;
    }
  }

  private isTokenValid(tokenInfo: any): boolean {
    if (!tokenInfo || !tokenInfo.exp || !tokenInfo.iat) {
      return false;
    }
    const currentTime = Math.floor(Date.now() / 1000);

    return !(tokenInfo.exp <= currentTime || tokenInfo.iat > currentTime);

  }
}
