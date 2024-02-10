import {Component, OnInit} from '@angular/core';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {TransactionState} from "../../enums/app-constans";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

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
        FormsModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    state: string[] = [TransactionState.IN_PROGRESS];
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 10;

    constructor(private transactionService: TransactionService) {
    }

    ngOnInit(): void {
        this.loadTransactions();
    }

    loadTransactions(): void {
        this.transactionService.getAllWithSearch(this.pageNumber, this.pageSize, this.state)
            .subscribe(data => {
                this.transactions = data.content;
            });
    }

    updateTransaction(transaction: Transaction, state: string): void {
        this.transactionService.changeTransactionStatus(transaction.id, state, transaction.adminBonus)
            .subscribe(() => {
                // Оновити список транзакцій після підтвердження
                this.loadTransactions();
            });
    }

    protected readonly TransactionState = TransactionState;
}
