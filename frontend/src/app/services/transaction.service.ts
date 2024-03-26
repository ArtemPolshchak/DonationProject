import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Transaction} from "../common/transaction";
import {map, Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {HttpClientService} from "./http-client.service";
import {GET, POST, PUT} from "../enums/app-constans";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllWithSearch(serverNames?: string[], donatorMails?: string, state?: string[], pageNumber?: number, pageSize?: number, sort?: string) {
        let params = new HttpParams();
        params = (serverNames && serverNames.length > 0) ? params.set('serverNames', serverNames.join(',')) : params;
        params = (donatorMails && donatorMails.length > 0) ? params.set('donatorMails', donatorMails) : params;
        params = (state && state.length > 0) ? params.set('state', state.join(',')) : params;
        params = (pageNumber) ? params.set('page', pageNumber.toString()) : params;
        params = (pageSize) ? params.set('size', pageSize.toString()) : params;
        params = (sort) ? params.set('sort', sort) : params;
        const url: string = 'api/transactions/search';
        return this.httpClient.process<GetTransactionResponse>(GET, url, true, params);
    }

    public getAll(pageNumber?: number, pageSize?: number) {
        const url: string = `api/transactions?page=${pageNumber}&pageSize=${pageSize}`
        console.log(url)
        return this.httpClient.process<GetTransactionResponse>(GET, url, true);
    }

    public confirmById(transactionId: number, state: string, adminBonus: number): Observable<GetTransactionResponse> {
        const url: string = `api/transactions/${transactionId}/confirm`;
        let transaction = new Transaction();
        transaction.adminBonus = adminBonus;
        transaction.state = state;
        return this.httpClient.process<GetTransactionResponse>(PUT, url, true, transaction);

    }

    public update(transaction: Transaction): Observable<GetTransactionResponse> {
        const url: string = `api/transactions/${transaction.id}`;
        return this.httpClient.process<GetTransactionResponse>(PUT, url, true, transaction);
    }

    public create(transaction: Transaction): Observable<GetTransactionResponse> {
        const url: string = `api/transactions`;
        return this.httpClient.process<GetTransactionResponse>(POST, url, true, transaction);
    }

    public getAllTransactionsFromOneDonator(donatorId: number, pageNumber?: number, pageSize?: number, sort?: string) {
        const url: string = `api/transactions/donators?id=${donatorId}&page=${pageNumber}&size=${pageSize}&sort=${sort}`;
        return this.httpClient.process<GetTransactionResponse>(GET, url, true);
    }
}

export interface GetTransactionResponse {
    content: Transaction[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

