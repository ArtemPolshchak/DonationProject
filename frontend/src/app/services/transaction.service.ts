import {Injectable} from '@angular/core';
import {Transaction} from "../common/transaction";
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";
import {HttpParams} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllWithSearch(pageNumber?: number, pageSize?: number, sort?: string, transactionState?: string[], serverNames?: string[], donatorMails?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort, donatorMails, serverNames, transactionState);
        const url: string = 'api/transactions/search';
        return this.httpClient.fetch<GetTransactionResponse>(url, true, params);
    }

    public confirmById(transactionId: number, state: string, adminBonus: number) {
        const url: string = `api/transactions/${transactionId}/confirm`;
        let transaction = new Transaction();
        transaction.adminBonus = adminBonus;
        transaction.state = state;
        return this.httpClient.load<GetTransactionResponse>(HttpMethod.PUT, url, true, transaction);

    }

    public update(transaction: Transaction) {
        const url: string = `api/transactions/${transaction.id}`;
        return this.httpClient.load<GetTransactionResponse>(HttpMethod.PUT, url, true, transaction);
    }

    public create(transaction: Transaction) {
        const url: string = `api/transactions`;
        return this.httpClient.load<GetTransactionResponse>(HttpMethod.POST, url, true, transaction);
    }

    public getAllTransactionsFromOneDonator(donatorId: number, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort);
        const url: string = `api/transactions/donators/${donatorId}`;
        return this.httpClient.fetch<GetTransactionResponse>(url, true, params);
    }

    public getImage(transactionId: number) {
        const url: string = `api/transactions/${transactionId}/img`
        return this.httpClient.fetch<ImageResponse>(url, true);
    }
}

export interface GetTransactionResponse {
    content: Transaction[];
    pageable: {
        pageNumber: number
        pageSize: number
    }
    totalElements: number;
}

export interface ImageResponse {
    data: string;
}
