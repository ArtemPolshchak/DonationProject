import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Injectable, OnInit} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HttpClientService extends HttpClient{
    headers?: HttpHeaders

    constructor(handler: HttpHandler) {
        super(handler);
        let token = StorageService.getToken();
        if (!token) {
            StorageService.watchStorage().subscribe( {
                next: value => {
                    token = value;
                }
            });
        }
        this.headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    }

    process<T>(method: string, url: string, auth: boolean, body?: any, params?: HttpParams) {
        if (auth && body && params) {
            return this.request<T>(method, url, {headers: this.headers, body: body, params: params});
        } else if  (auth && body) {
            return this.request<T>(method, url, {headers: this.headers, body: body});
        } else if (body && params) {
            return this.request<T>(method, url, {body: body, params: params});
        } else if (body) {
            return this.request<T>(method, url, {body: body});
        } else if (auth) {
            return this.request<T>(method, url, {headers: this.headers});
        } else if (params) {
            return this.request<T>(method, url, {params: params});
        }
        return this.request<T>(method, url);
    }
}