import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, JsonPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
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
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TransactionDialog} from "./transaction.dialog/transaction-dialog.component";
import {MatInput} from "@angular/material/input";
import {Server} from "../../common/server";
import {OpenImageDialogComponent} from "../open-image-dialog/open-image-dialog.component";
import {StorageService} from "../../services/storage.service";

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
        FormsModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe, MatInput, NgIf, NgStyle
    ],
    templateUrl: './donations.component.html',
    styleUrl: './donations.component.scss'
})
export class DonationsComponent implements OnInit {
    transactions: Transaction[] = [];
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
    transactionState: string[] = ["IN_PROGRESS", "CANCELLED", "COMPLETED"];
    serverNames?: string[];
    donatorsMail?: string;
    sortState?: string = "dateCreated,desc";
    stateFilter: string = "";
    selectedServer: string = "";
    servers: Server[] = [];


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
        this.transactionState = [];
        if (this.stateFilter !== '') {
            this.transactionState.push(this.stateFilter);
        }
        this.serverNames = this.selectedServer ? [this.selectedServer] : undefined;
        this.pageNumber = 0
        this.paginator.pageIndex = this.pageNumber;
        this.getTransactionPage();
    }


    getTransactionPage(): void {
        this.transactionService.getAllWithSearch(
            this.pageNumber, this.pageSize, this.sortState,
            this.transactionState, this.serverNames, this.donatorsMail)
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

    openImageDialog(image: string) {
        this.dialog.open(OpenImageDialogComponent, {
            width: '70%',
            data: image,
        });
    }
}