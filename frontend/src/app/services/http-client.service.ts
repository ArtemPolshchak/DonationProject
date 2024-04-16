import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Injectable} from "@angular/core";
import {HttpMethod} from "../enums/http-method";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpClientService extends HttpClient {
    headers?: HttpHeaders
    token?: string;

    constructor(handler: HttpHandler) {
        super(handler);
    }

    fetch<T>(url: string, auth: boolean, params?: HttpParams): Observable<T> {
        let options: any = {};
        params ? options.params = params : {};
        auth ? options.headers = this.getHeaders() : {};
        return this.request<T>(HttpMethod.GET, url, <Object>options);
    }

    load<T>(method: HttpMethod, url: string, auth: boolean, body?: any): Observable<T> {
        let options: any = {};
        body ? options.body = body : options;
        auth ? options.headers = this.getHeaders() : options;
        return this.request<T>(method, url, <Object>options);
    }

    getHttpParams(options: Record<string, any>) {
        let params = new HttpParams();
        Object.keys(options)
            .forEach(k => options[k] ? params = params.set(k, options[k] as string) : {})
        return params;
    }

    private getHeaders() {
        return new HttpHeaders({'Authorization': `Bearer ${StorageService.getToken()}`});
    }
}