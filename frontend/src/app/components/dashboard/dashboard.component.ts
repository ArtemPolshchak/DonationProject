import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {TransactionState} from "../../enums/app-constans";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        NgbAccordionModule,
        NgForOf,
        DatePipe,
        CurrencyPipe,
        SidebarComponent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatPaginator
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    state: string[] = [TransactionState.IN_PROGRESS];
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
    serverNames?: string[];
    donatorMails?: string;
    sortState?: string = "dateCreated,desc";
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private transactionService: TransactionService,  private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getFeedbackPage();
    }

    getFeedbackPage(): void {
        this.transactionService.getAllWithSearch(this.serverNames, this.donatorMails, this.state, this.pageNumber, this.pageSize, this.sortState)
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



    confirmTransaction(transaction: Transaction, state: string): void {
        this.transactionService.changeTransactionStatus(transaction.id, state, transaction.adminBonus)
            .subscribe(() => {
                this.getFeedbackPage();
            });
    }

    protected readonly TransactionState = TransactionState;
}
