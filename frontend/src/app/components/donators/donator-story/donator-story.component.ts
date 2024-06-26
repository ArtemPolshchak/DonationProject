import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Transaction} from "../../../common/transaction";
import {TransactionService} from "../../../services/transaction.service";
import {CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Server} from "../../../common/server";
import {TransactionState} from "../../../enums/transaction-state";
import {OpenImageDialogComponent} from "../../open-image-dialog/open-image-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {StorageService} from "../../../services/storage.service";
import {ToasterService} from "../../../services/toaster.service";
import {NO_IMG_PATH} from "../../../enums/app-constans";

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
        FormsModule,
        NgIf,
        DecimalPipe
    ],
    templateUrl: './donator-story.component.html',
    styleUrl: './donator-story.component.scss'
})
export class DonatorStoryComponent implements OnInit {
    transactions: Transaction[] = [];
    donatorId!: number;
    email!: string;
    totalDonations!: number;
    sortState: string = 'dateCreated,desc';
    state: string[] = [TransactionState.COMPLETED];
    selectedServerName!: string;
    servers: Server[] = [];
    pageNumber: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private transactionService: TransactionService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private toasterService: ToasterService
    ) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.donatorId = +params['id'];
            this.email = params['email'];
            this.selectedServerName = params['serverName'] ? params['serverName'] :'';
            this.servers = StorageService.getServers()
            if (this.servers.length === 0) {
                StorageService.watchServers().subscribe({
                    next: (response) => {
                        this.servers = response
                        this.getDonatorTransactions()
                    }
                })
            } else {
                this.getDonatorTransactions();
            }
        });
    }

    goToDonators(): void {
        this.router.navigate(['/donators']);
    }

    applyFilterSort(): void {
        this.pageNumber = 0;
        this.paginator.pageIndex = this.pageNumber;
        this.getDonatorTransactions();
    }

    getDonatorTransactions(): void {
        this.transactionService
            .getAllWithSearch(
                this.pageNumber,
                this.pageSize,
                this.sortState,
                this.state,
                undefined,
                this.selectedServerName ? [this.selectedServerName] : [],
                this.email,
            )
            .subscribe(data => {
                this.transactions = data.content;
                this.totalDonations = this.transactions
                    .reduce((sum, t) => sum + t.contributionAmount, 0)
                this.totalElements = data.totalElements;
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getDonatorTransactions();
    }

    openImageDialog(transactionId: number) {
        this.dialog.open(OpenImageDialogComponent, {
            data: transactionId,
        });
    }

    protected readonly NO_IMG_PATH = NO_IMG_PATH;
}
