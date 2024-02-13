import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Transaction} from "../common/transaction";
import {map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClient) {
    }

    public getAllWithSearch(serverNames?: string[], donatorMails?: string[], state?: string[], pageNumber?: number, pageSize?: number ) {
        let params = new HttpParams();

        params = (serverNames && serverNames.length > 0) ? params.set('serverNames', serverNames.join(',')) : params;
        params = (donatorMails && donatorMails.length > 0) ? params.set('donatorMails', donatorMails.join(',')) : params;
        params = (state && state.length > 0) ? params.set('state', state.join(',')) : params;
        params = (pageNumber) ? params.set('page', pageNumber.toString()) : params;
        params = (pageSize) ? params.set('size', pageSize.toString()) : params;

        const url: string = 'api/transactions/search';

        return this.httpClient.get<GetTransactionResponse>(url, { params: params, headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')} }).pipe(
            map(response => response)
        );
    }

    public getAll(pageNumber?: number, pageSize?: number) {
        const url: string = `api/transactions?page=${pageNumber}&pageSize=${pageSize}`
        console.log(url)
        return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
            map(response => response));
    }

    public confirmById(transactionId: number, state: string, adminBonus: number): Observable<void> {
        const url: string = `api/transactions/${transactionId}/confirm`;
        let transaction = new Transaction();
        transaction.adminBonus = adminBonus;
        transaction.state = state;
        return this.httpClient.put<void>(url, transaction,
            {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}});
    }

    public updateById(transaction: Transaction) {
        const url: string = `api/transactions/${transaction.id}`;
        return this.httpClient.put<void>(url, transaction,  {
            headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}
        });
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

