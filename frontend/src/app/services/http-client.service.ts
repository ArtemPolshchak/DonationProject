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
    token: string | undefined;


    constructor(handler: HttpHandler) {
        super(handler);
    }

    fetch<T>(url: string, auth: boolean, params?: HttpParams): Observable<T> {
        let options: any = {};
        params ? options.params = params : options;
        console.log("params:  " + params)
        auth ? options.headers = this.getHeaders() : options;
        return this.request<T>(HttpMethod.GET, url, <Object>options);
    }

    load<T>(method: HttpMethod, url: string, auth: boolean, body?: any): Observable<T> {
        let options: any = {};
        body ? options.body = body : options;
        auth ? options.headers = this.getHeaders() : options;
        return this.request<T>(method, url, <Object>options);
    }

    getHttpParams(pageNumber?: number, pageSize?: number, sort?: string, donatorMails?: string, serverNames?: string[], state?: string[], paymentMethod?: string[]) {
        let params = new HttpParams();
        params = (serverNames && serverNames.length > 0) ? params.set('serverNames', serverNames.join(',')) : params;
        params = (donatorMails && donatorMails.length > 0) ? params.set('donatorMails', donatorMails) : params;
        params = (state && state.length > 0) ? params.set('state', state.join(',')) : params;
        params = (paymentMethod && paymentMethod.length > 0) ? params.set('paymentMethod', paymentMethod.join(',')) : params;
        params = (pageNumber) ? params.set('page', pageNumber.toString()) : params;
        params = (pageSize) ? params.set('size', pageSize.toString()) : params;
        params = (sort) ? params.set('sort', sort) : params;
        return params;
    }

    private getHeaders() {
        return  new HttpHeaders({'Authorization': `Bearer ${StorageService.getToken()}`});
    }
}