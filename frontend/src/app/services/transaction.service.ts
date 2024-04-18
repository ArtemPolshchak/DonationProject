import {Injectable} from '@angular/core';
import {Transaction} from "../common/transaction";
import {HttpClientService} from "./http-client.service";
import {HttpMethod} from "../enums/http-method";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClientService) {
    }

    public getAllWithSearch(pageNumber?: number, pageSize?: number, sort?: string, state?: string[], paymentMethod?: string[], serverNames?: string[], donatorMails?: string) {
        const url: string = 'api/transactions/search';
        const params = this.httpClient.getHttpParams({
            page: pageNumber,
            size: pageSize,
            sort: sort,
            donatorMails: donatorMails,
            serverNames: serverNames?.join(','),
            state: state?.join(','),
            paymentMethod: paymentMethod?.join(','),
        });
        return this.httpClient.fetch<GetTransactionResponse>(url, true, params);
    }

    public confirmById(transactionId: number, state: string, adminBonus: number) {
        const url: string = `api/transactions/${transactionId}/confirm`;
        return this.httpClient.load<GetTransactionResponse>(
            HttpMethod.PUT, url, true, {adminBonus: adminBonus, state: state});
    }

    public update(transaction: Transaction) {
        const url: string = `api/transactions/${transaction.id}`;
        return this.httpClient.load<GetTransactionResponse>(HttpMethod.PUT, url, true, transaction);
    }

    public create(transaction: Transaction) {
        const url: string = `api/transactions`;
        return this.httpClient.load<GetTransactionResponse>(HttpMethod.POST, url, true, transaction);
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
