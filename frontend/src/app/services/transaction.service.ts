import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Transaction} from "../common/transaction";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    constructor(private httpClient: HttpClient) {
    }

    public getAll() {
        const url: string = "http://localhost:5000/api/transactions"
        return this.httpClient.get<GetTransactionResponse>(url).pipe(
            map(response => response));
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

