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
import {MatSnackBar} from "@angular/material/snack-bar";
import {OpenImageDialogComponent} from "../open-image-dialog/open-image-dialog.component";

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
    durationInSeconds: number = 5;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private transactionService: TransactionService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.getTransactionOnPage();
    }

    getTransactionOnPage(): void {
        this.transactionService.getAllWithSearch(this.serverNames, this.donatorMails, this.state, this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.transactions = response.content;
                this.totalElements = response.totalElements;
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getTransactionOnPage();
    }

    confirmTransaction(transaction: Transaction, state: string): void {
        if (state === TransactionState.CANCELLED) {
            transaction.adminBonus = 0;
        }
        this.transactionService.confirmById(transaction.id, state, transaction.adminBonus)
            .subscribe(() => {
                this.getTransactionOnPage();
                this.openSnackBar(state);
            }
        );
    }

    openSnackBar(state: string) {
        const message = state === TransactionState.COMPLETED ? 'Заявка Подтверждена!' : 'Заявка Отменена!';
        this._snackBar.open(message, 'Закрыть', {
            duration: this.durationInSeconds * 1000,
        });
    }

    openImageDialog(image: string) {
        this.dialog.open(OpenImageDialogComponent, {
            width: '50%',
            data: image,
        });
    }

    protected readonly TransactionState = TransactionState;
}
