import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgForOf,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit{
  transactions?: Transaction[];
  pageNumber: number = 0;
  pageSize: number = 10;
  state: string[] = [];
  sortField: string = "dateCreated"
  sortCriteria: string = "desc"
  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getAll(this.pageNumber, this.pageSize, this.state).subscribe(data =>
    this.transactions = data.content)
  }

}
