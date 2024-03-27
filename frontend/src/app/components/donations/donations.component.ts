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
import {HttpEventType} from "@angular/common/http";

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
    state: string[] = ["IN_PROGRESS", "CANCELLED", "COMPLETED"];
    serverNames?: string[];
    donatorsMail?: string;
    sortState?: string = "dateCreated,desc";
    stateFilter: string = "";
    selectedServer: string = "";
    servers: Server[];


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
        const serversData = StorageService.getItem('servers');
        this.servers = serversData ? JSON.parse(serversData) : [];
    }

    ngOnInit(): void {
        this.getTransactionPage();
    }

    applyFilterSortSearch(): void {
        this.state = [];
        if (this.stateFilter !== '') {
            this.state.push(this.stateFilter);
        }
        this.serverNames = this.selectedServer ? [this.selectedServer] : undefined;
        this.getTransactionPage();
    }


    getTransactionPage(): void {
        this.transactionService.getAllWithSearch(
            this.serverNames, this.donatorsMail,
            this.state, this.pageNumber,
            this.pageSize, this.sortState)
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