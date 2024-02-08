import { Injectable } from '@angular/core';
import { TOKEN_KEY, USER_KEY } from '../enums/app-constans';
import {User} from "../common/user";
import {jwtDecode} from "jwt-decode";
import {error} from "@angular/compiler-cli/src/transformers/util";


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

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

  public getUser(): User | null {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      return new User(tokenInfo.id, tokenInfo.sub, tokenInfo.email, tokenInfo.role)
    }
    return null;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return error("Can't decode token");
    }
  }
}
