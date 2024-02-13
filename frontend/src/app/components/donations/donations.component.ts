import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, JsonPipe, NgForOf} from "@angular/common";
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator, PageEvent } from "@angular/material/paginator";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreateTransactionDialog} from "./donations.dialog/create.transaction/create-transaction-dialog.component";



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
    MatPaginator,
    MatCheckbox,
    FormsModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe
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
  serverNames?: string[];
  donatorMails?: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  toppings = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });

  constructor(
      private transactionService: TransactionService,
      private dialog: MatDialog,
      private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getFeedbackPage();
  }

  getFeedbackPage(): void {
    this.transactionService.getAllWithSearch(this.serverNames, this.donatorMails, this.state, this.pageNumber, this.pageSize)
        .subscribe((response) => {
          this.transactions = response.content;
          this.totalElements = response.totalElements;
        });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getFeedbackPage();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTransactionDialog, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.transactionService.updateById(result);
    });
  }
}