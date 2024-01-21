import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {

  constructor(private httpClient: HttpClient) {
  }

  public getTransactions() {
   return  this.httpClient.get("http://localhost:5000/api/transactions")
  }
}
