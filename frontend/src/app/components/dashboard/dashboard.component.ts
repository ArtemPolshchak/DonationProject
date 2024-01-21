import {Component, OnInit} from '@angular/core';
import {NgbAccordionModule, NgbDateAdapter, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DatePipe, formatDate, NgForOf} from "@angular/common";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgForOf,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  items: string[] = ['first', 'second', 'third']
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.transactionService.getAll()
        .subscribe(data => {
          this.transactions = data.content
          console.log(this.transactions)
        })
  }

    protected readonly Array = Array;
  protected readonly Object = Object;
  protected readonly NgbDateParserFormatter = NgbDateParserFormatter;
  protected readonly formatDate = formatDate;
  protected readonly NgbDateAdapter = NgbDateAdapter;
  protected readonly DatePipe = DatePipe;
}
