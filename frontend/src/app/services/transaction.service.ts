import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private httpClient: HttpClient) { }

  public getAll() {
    const url = "localhost:5000/api/transactions/"
    return this.httpClient.get(url);
  }
}
