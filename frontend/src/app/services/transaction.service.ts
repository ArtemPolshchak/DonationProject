import {Injectable} from '@angular/core';
import {Transaction} from "../common/transaction";
import {HttpClientService} from "./http-client.service";
import {GET, POST, PUT} from "../enums/app-constans";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllWithSearch(serverNames?: string[], donatorMails?: string, state?: string[], pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort, donatorMails, serverNames, state);
        const url: string = 'api/transactions/search';
        return this.httpClient.fetch<GetTransactionResponse>(GET, url, true, params);
    }

    public getAll(pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort);
        const url: string = `api/transactions`
        return this.httpClient.fetch<GetTransactionResponse>(GET, url, true, params);
    }

    public confirmById(transactionId: number, state: string, adminBonus: number) {
        const url: string = `api/transactions/${transactionId}/confirm`;
        let transaction = new Transaction();
        transaction.adminBonus = adminBonus;
        transaction.state = state;
        return this.httpClient.load<GetTransactionResponse>(PUT, url, true, transaction);

    }

    public update(transaction: Transaction) {
        const url: string = `api/transactions/${transaction.id}`;
        return this.httpClient.load<GetTransactionResponse>(PUT, url, true, transaction);
    }

    public create(transaction: Transaction) {
        const url: string = `api/transactions`;
        return this.httpClient.load<GetTransactionResponse>(POST, url, true, transaction);
    }

    public getAllTransactionsFromOneDonator(donatorId: number, pageNumber?: number, pageSize?: number, sort?: string) {
        let params = this.httpClient.getHttpParams(pageNumber, pageSize, sort);
        const url: string = `api/transactions/donators/${donatorId}`;
        return this.httpClient.fetch<GetTransactionResponse>(GET, url, true, params);
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

