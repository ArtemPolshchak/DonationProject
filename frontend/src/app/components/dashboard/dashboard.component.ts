import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {TransactionState} from "../../enums/transaction-state";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OpenImageDialogComponent} from "../open-image-dialog/open-image-dialog.component";
import {NO_IMG_PATH} from "../../enums/app-constans";

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
        MatPaginator,
        NgIf
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    transactionState: string[] = [TransactionState.IN_PROGRESS];
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
    sortState: string = "dateCreated,desc";
    durationInSeconds: number = 5;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private transactionService: TransactionService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.getAll();
    }

    getAll(): void {
        this.transactionService.getAllWithSearch(this.pageNumber, this.pageSize, this.sortState, this.transactionState)
            .subscribe((data) => {
                    this.transactions = data.content;
                    this.totalElements = data.totalElements;
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getAll();
    }

    confirmTransaction(transaction: Transaction, state: string): void {
        if (state === TransactionState.CANCELLED) {
            transaction.adminBonus = 0;
        }
        this.transactionService.confirmById(transaction.id!, state, transaction.adminBonus)
            .subscribe(() => {
                this.getAll();
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
            data: image,
        });
    }

    sort() {
        this.pageNumber = 0;
        this.paginator.pageIndex = this.pageNumber;
        this.getAll();
    }

    protected readonly TransactionState = TransactionState;
    protected readonly NO_IMG_PATH = NO_IMG_PATH;
}
