import {Component, OnInit} from '@angular/core';
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
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.scss'
})
export class DonationsComponent implements OnInit{


  transactions: Transaction[] = [];
  pageNumber: number = 0;
  pageSize: number = 1;
  state: string[] = ["IN_PROGRESS", "CANCELLED", "COMPLETED"];
  sortField: string = "dateCreated"
  sortCriteria: string = "desc"
  constructor(private transactionService: TransactionService, public dialog: MatDialog) {}


  ngOnInit(): void {
    this.transactionService.getAll(this.pageNumber, this.pageSize, this.state).subscribe(data =>
    this.transactions = data.content)
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DonationsdialogComponent, {
      width: '600px', // Установіть ширину вікна за вашими вимогами
      // Можна також передати будь-які дані у компонент діалогового вікна
      // data: { /* ваші дані */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Тут можна додати логіку для обробки результату закриття діалогового вікна
    });
  }
}
