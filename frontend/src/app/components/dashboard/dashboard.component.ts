import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {TransactionState} from "../../enums/transaction-state";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OpenImageDialogComponent} from "../open-image-dialog/open-image-dialog.component";
import {NgxColorsColor, NgxColorsModule} from 'ngx-colors';
import {Server} from "../../common/server";
import {StorageService} from "../../services/storage.service";
import {LAST_SERVER_KEY} from "../../enums/app-constans";

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
        NgxColorsModule,
        NgIf,
        ReactiveFormsModule,
        NgStyle
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    servers: Server[] = [];
    colorFormControl = new FormControl(null) ;
    transactionState: string[] = [TransactionState.IN_PROGRESS];
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
    sortState: string = "dateCreated,desc";
    durationInSeconds: number = 5;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    hideColorPicker: boolean = true;
    hideTextInput: boolean = true;
    colors: Array<any> = [
        "#D3D3D3",
        "#d50954",
        "#43a047",
        "#039be5",
        "#ffeb3b",
    ];

    constructor(private transactionService: TransactionService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.servers = StorageService.getServers();
        this.getAll();
    }

    updateTransactionColor(newColor: string, transaction: Transaction) {
        if(newColor && newColor != transaction.color) {
            transaction.color = newColor;
            transaction.serverId = this.findServerByName(transaction.serverName).id;
            this.transactionService.update(transaction).subscribe({
                    next: (result) => {
                        this.openSnackBar("Транзакция успешно изменена")
                    },
                    error: (err) => {
                        this.openSnackBar("Ошибка при обновлении транзакции: " + err.message)
                    },
                },
            );
        }
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
            width: '50%',
            data: image,
        });
    }

    sort() {
        this.pageNumber = 0;
        this.paginator.pageIndex = this.pageNumber;
        this.getAll();
    }

    private findServerByName(serverName: string): Server {
        return this.servers.find(s => s.serverName === serverName)!;
    }

    protected readonly TransactionState = TransactionState;

}
