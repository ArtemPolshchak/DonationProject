import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Transaction} from "../common/transaction";
import {map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClient) {
    }

    public getAllWithSearch(pageNumber?: number, pageSize?: number, state?: string[]) {
        const url: string = `api/transactions/search?state=${state}&page=${pageNumber}&size=${pageSize}`

        console.log(url)
        return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
            map(response => response));
    }

    public getAll(pageNumber?: number, pageSize?: number, state?: string[]) {
        const url: string = `api/transactions?page=${pageNumber}&size=${pageSize}`
        console.log(url)
        return this.httpClient.get<GetTransactionResponse>(url, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}).pipe(
            map(response => response));
    }

    public changeTransactionStatus(transactionId: number, state: string, adminBonus: number): Observable<void> {
        const url: string = `api/transactions/${transactionId}/confirm`;
        let transaction = new Transaction();
        transaction.adminBonus = adminBonus;
        transaction.state = state;
        return this.httpClient.put<void>(url, transaction,  {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')}});
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

