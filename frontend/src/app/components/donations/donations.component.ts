import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import { MatDialog } from '@angular/material/dialog';
import { DonationsdialogComponent } from '../donationsdialog/donationsdialog.component';
import {MatPaginator, PageEvent } from "@angular/material/paginator";


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
    NgbAccordionItem,
    MatPaginator
  ],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.scss'
})
export class DonationsComponent implements OnInit{
  transactions: Transaction[] = [];
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  state: string[] = ["IN_PROGRESS", "CANCELLED", "COMPLETED"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
      private transactionService: TransactionService,
      private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFeedbackPage();
  }

  getFeedbackPage(): void {
    this.transactionService.getAllWithSearch(this.pageNumber, this.pageSize, this.state)
        .subscribe((response) => {
          this.transactions = response.content;
          this.totalElements = response.totalElements;
          console.log("transactions.length-----" + this.transactions.length)
          console.log("page number-----" + this.pageNumber)
          console.log("page size---------" + this.pageSize)
          console.log("page state------" + this.state)
          console.log("page totalElements------" + this.totalElements)
        });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log('Page size======:', this.pageSize);
    console.log('pageNumber=========:', this.pageNumber);
    this.getFeedbackPage();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DonationsdialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Додати обробку результату закриття діалогового вікна, якщо потрібно
    });
  }
}