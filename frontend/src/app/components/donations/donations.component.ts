import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../../services/transaction.service";
import {Transaction} from "../../common/transaction";
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TransactionDialog} from "./transaction-dialog/transaction-dialog.component";
import {MatInput} from "@angular/material/input";
import {Server} from "../../common/server";
import {OpenImageDialogComponent} from "../open-image-dialog/open-image-dialog.component";
import {StorageService} from "../../services/storage.service";
import {NO_IMG_PATH} from "../../enums/app-constans";
import {ToasterService} from "../../services/toaster.service";
import {MatIconButton} from "@angular/material/button";

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
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        JsonPipe,
        MatInput,
        NgIf,
        NgStyle,
        DecimalPipe,
        MatIconButton
    ],
    templateUrl: './donations.component.html',
    styleUrl: './donations.component.scss'
})
export class DonationsComponent implements OnInit {
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;
    transactionState?: string[];
    serverNames?: string[];
    paymentMethods?: string[];
    donatorsMail?: string;
    sortState: string = "dateCreated,desc";
    stateFilter: string = "";
    selectedServer: string = "";
    paymentMethod: string = "";
    servers: Server[] = [];
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private toasterService: ToasterService,
        private transactionService: TransactionService,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.servers = StorageService.getServers()
        if (this.servers.length === 0) {
            StorageService.watchServers().subscribe({
                next: (response) => {
                    this.servers = response;
                    this.getTransactionPage()
                }
            });
        } else {
            this.getTransactionPage();
        }
    }

    applyFilterSortSearch(): void {
        this.transactionState = this.stateFilter ? [this.stateFilter] : undefined;
        this.serverNames = this.selectedServer ? [this.selectedServer] : undefined;
        this.paymentMethods = this.paymentMethod ? [this.paymentMethod] : undefined;
        this.pageNumber = 0
        this.paginator.pageIndex = this.pageNumber;
        this.getTransactionPage();
    }


    getTransactionPage(): void {
        this.transactionService.getAllWithSearch(
            this.pageNumber, this.pageSize, this.sortState,
            this.transactionState, this.paymentMethods, this.serverNames,  this.donatorsMail)
            .subscribe((data) => {
                this.transactions = data.content;
                this.totalElements = data.totalElements;
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getTransactionPage();
    }

    openTransactionDialog(transaction?: Transaction): void {
        const dialogRef = this.dialog.open(TransactionDialog, {
            width: '50%',
            data: {
                servers: this.servers,
                transaction: transaction
            }
        });
        dialogRef.componentInstance.transactionResponse.subscribe(() => {
            this.getTransactionPage()
        });
    }

    openImageDialog(transactionId: number) {
        this.dialog.open(OpenImageDialogComponent, {
            data: transactionId,
        });
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }

    protected readonly NO_IMG_PATH = NO_IMG_PATH;
}