import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Transaction} from "../common/transaction";
import {map, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClient) {
    }

    public getAllWithSearch(pageNumber?: number, pageSize?: number, state?: string[]) {
        const url: string = `http://localhost:5000/api/transactions/search?state=${state}&page=${pageNumber}&pageSize=${pageSize}`
        console.log(url)
        return this.httpClient.get<GetTransactionResponse>(url).pipe(
            map(response => response));
    }

    public getAll(pageNumber?: number, pageSize?: number, state?: string[]) {
        const url: string = `http://localhost:5000/api/transactions?page=${pageNumber}&pageSize=${pageSize}`
        console.log(url)
        return this.httpClient.get<GetTransactionResponse>(url).pipe(
            map(response => response));
    }

    public changeTransactionStatus(transactionId: number, state: string): Observable<void> {
        const url: string = ` http://localhost:5000/api/transactions/${transactionId}?state=${state}`;
        return this.httpClient.put<void>(url, {});
    }
}

interface GetTransactionResponse {
    content: Transaction[];
    pageable: {
        pageNumber: number;
        pageSize: number
    }
    totalElements: number;
}

