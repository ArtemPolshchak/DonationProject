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
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  sortState?: string = "dateCreated,desc";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private transactionService: TransactionService,
              private route: ActivatedRoute,
              private  router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.donatorId = +params['id'];
      this.email = params['email'];
      this.totalDonations = +params['totalDonations'];

      this.getDonatorTransactions(this.donatorId);
    });
  }
  getDonatorTransactions(donatorId: number): void {
    this.transactionService.getAllTransactionsFromOneDonator(donatorId, this.pageNumber, this.pageSize, this.sortState)
        .subscribe((response) => {
          this.transactions = response.content;
          this.totalElements = response.totalElements;
        });
  }


  goToDonators(): void {
    this.router.navigate(['/donators']);
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDonatorTransactions(this.donatorId);
  }
}
