import {Component, OnInit} from '@angular/core';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
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
export class DashboardComponent implements OnInit {
    state: string[] = ["IN_PROGRESS"];
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 10;

    constructor(private transactionService: TransactionService) {
    }

    ngOnInit(): void {
        this.transactionService.getAll(this.pageNumber, this.pageSize, this.state)
            .subscribe(data => {
                this.transactions = data.content
                console.log(this.transactions)
            })
    }



}
