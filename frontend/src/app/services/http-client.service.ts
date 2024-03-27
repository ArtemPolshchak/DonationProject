import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HttpClientService extends HttpClient {
    headers?: HttpHeaders
    token: string | undefined;


    constructor(handler: HttpHandler) {
        super(handler);
        this.token = StorageService.getToken()
        if (this.token) {
            this.headers = new HttpHeaders({'Authorization': 'Bearer ' + StorageService.getToken()});
        } else {
            StorageService.watchStorageToken().subscribe({
                next: () => {
                    this.headers = new HttpHeaders({'Authorization': 'Bearer ' + StorageService.getToken()});
                }
            });
        }
    }

    fetch<T>(method: string, url: string, auth: boolean, params?: HttpParams) {
        let options: any = {};
        auth ? options.headers = this.headers : options;
        params ? options.params = params : options;
        return this.request<T>(method, url, <Object>options);
    }

    load<T>(method: string, url: string, auth: boolean, body?: any) {
        let options: any = {};
        auth ? options.headers = this.headers : options;
        body ? options.body = body : options;
        return this.request<T>(method, url, <Object>options);
    }

    getHttpParams(pageNumber?: number, pageSize?: number, sort?: string, donatorMails?: string, serverNames?: string[], state?: string[]) {
        let params = new HttpParams();
        params = (serverNames && serverNames.length > 0) ? params.set('serverNames', serverNames.join(',')) : params;
        params = (donatorMails && donatorMails.length > 0) ? params.set('donatorMails', donatorMails) : params;
        params = (state && state.length > 0) ? params.set('state', state.join(',')) : params;
        params = (pageNumber) ? params.set('page', pageNumber.toString()) : params;
        params = (pageSize) ? params.set('size', pageSize.toString()) : params;
        params = (sort) ? params.set('sort', sort) : params;
        return params;
    }
}