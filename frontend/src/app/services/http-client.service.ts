import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {OnInit} from "@angular/core";
import {TOKEN_KEY} from "../enums/app-constans";

export class HttpClientService extends HttpClient implements OnInit {
    headers?: HttpHeaders

    constructor(handler: HttpHandler) {
        super(handler);
    }

    ngOnInit(): void {
        localStorage.getItem(TOKEN_KEY)
        if (StorageService.getToken()) {
            this.headers = new HttpHeaders({'Authorization': 'Bearer ' + StorageService.getToken()})
        }
    }
}