import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Transaction} from "../../common/transaction";
import {TransactionService} from "../../services/transaction.service";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Server} from "../../common/server";
import {TransactionState} from "../../enums/app-constans";
import {OpenImageDialogComponent} from "../open-image-dialog/open-image-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-donatorstory',
  standalone: true,
  imports: [
    MatPaginator,
    CurrencyPipe,
    DatePipe,
    MatFormField,
    MatInput,
    MatLabel,
    NgForOf,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './donatorstory.component.html',
  styleUrl: './donatorstory.component.scss'
})
export class DonatorstoryComponent implements OnInit {
  transactions: Transaction[] = [];
  donatorId!: number;
  email!: string;
  totalDonations!: number;
  sortState = 'dateCreated,desc';
  state: string[] = [TransactionState.COMPLETED];
  selectedServer = '';
  servers: Server[] = [];
  serverNames?: string[];

  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
      private transactionService: TransactionService,
      private route: ActivatedRoute,
      private router: Router,
      private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.donatorId = +params['id'];
      this.email = params['email'];
      this.totalDonations = +params['totalDonations'];
      this.getDonatorTransactions();
      const serversData = sessionStorage.getItem('servers');
      if (serversData) {
        this.servers = JSON.parse(serversData);
      }
    });
  }

  goToDonators(): void {
    this.router.navigate(['/donators']);
  }

  applyFilterSort(): void {
    this.getDonatorTransactions();
  }

  getDonatorTransactions(): void {
    this.transactionService
        .getAllWithSearch(
            this.selectedServer ? [this.selectedServer] : [],
            this.email,
            this.state,
            this.pageNumber,
            this.pageSize,
            this.sortState
        )
        .subscribe(response => {
          this.transactions = response.content;
          this.totalElements = response.totalElements;
        });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDonatorTransactions();
  }

  openImageDialog(image: string) {
    const dialogRef = this.dialog.open(OpenImageDialogComponent, {
      width: '50%',
      data: image,
    });
  }
}
