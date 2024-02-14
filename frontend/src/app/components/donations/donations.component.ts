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
import {DonationsDialogComponent} from "./donations.dialog/donations-dialog.component";
import {MatInput} from "@angular/material/input";
import {TransactionState} from "../../enums/app-constans";
import {Server} from "../../common/server";

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
    FormsModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe, MatInput
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
  donatorsMail?: string;
  sortState?: string = "dateCreated,desc";
  stateFilter: string = "";
  servers: Server[] = [];
  selectedServer: string = "";



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
    this.getTransactionPage();
    const serversData = sessionStorage.getItem('servers');
    if (serversData) {
      this.servers = JSON.parse(serversData);
    }
  }

  applyFilterSortSearch(): void {
    this.state = []; // Очистити попередні фільтри стану
    if (this.stateFilter !== '') {
      this.state.push(this.stateFilter);
    }
    // Передайте обраний сервер для фільтрації
    this.serverNames = this.selectedServer ? [this.selectedServer] : undefined;
    // Викликати метод для отримання сторінки транзакцій з новими параметрами
    this.getTransactionPage();
  }


  getTransactionPage(): void {

    this.transactionService.getAllWithSearch(this.serverNames, this.donatorsMail, this.state, this.pageNumber, this.pageSize, this.sortState)
        .subscribe((response) => {
          this.transactions = response.content;
          this.totalElements = response.totalElements;
        });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getTransactionPage();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DonationsDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  protected readonly TransactionState = TransactionState;
}
