import {Component, OnInit, ViewChild} from '@angular/core';
import {DonatorService} from "../../services/donator.service";
import {Donator} from "../../common/donator";
import {NgForOf, NgStyle} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DonatorBonusDialogComponent} from "./donator-bonus-dialog/donator-bonus-dialog.component";
import {CreateDonatorDialogComponent} from "./create-donator-dialog/create-donator-dialog.component";

import {Server} from "../../common/server";
import {StorageService} from "../../services/storage.service";

@Component({
    selector: 'app-donators',
    standalone: true,
    imports: [
        NgForOf,
        MatFormField,
        MatInput,
        MatIcon,
        MatButton,
        FormsModule,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatLabel,
        MatPaginator,
        MatIconButton,
        MatMiniFabButton,
        NgStyle,
    ],
    templateUrl: './donators.component.html',
    styleUrl: './donators.component.scss'
})
export class DonatorsComponent implements OnInit {
    servers: Server[] = [];
    donators: Donator[] = [];
    pageNumber: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;
    selectedItem: any;
    donatorsMail?: string;
    ascOrder: string = "asc";
    descOrder: string = "desc";
    defaultSortField: string = "totalDonations"
    sortOrder: string = this.descOrder;
    sortState: string = this.defaultSortField + ',' + this.sortOrder;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private donatorService: DonatorService,
                private dialog: MatDialog,
                private router: Router) {
    }

    ngOnInit(): void {
        this.servers = StorageService.getServers()
        if (this.servers.length === 0) {
            StorageService.watchServers().subscribe({
                next: (response) => this.servers = response
            })
        }
        this.getAll();
    }

    goToDonatorStory(donatorId: number, email: string, totalDonations: number | undefined): void {
        if (typeof totalDonations !== 'undefined') {
            this.router.navigate(['/donator-story', donatorId, email, totalDonations]);
        } else {
            console.error('Total donations is undefined.');
        }
    }

    handleClick($event: any) {
        $event.stopPropagation();
    }

    select(item: any) {
        this.selectedItem = item;
    }

    sort(sortField: string) {
        this.sortOrder = this.sortOrder === this.descOrder ? this.ascOrder : this.descOrder;
        this.sortState = `${sortField},${this.sortOrder}`;
        this.getAll();
    }

    getAll(): void {
       // this.sortState = this.defaultSortField + ',' + this.sortOrder;
        this.donatorService.search(this.pageNumber, this.pageSize, this.sortState, this.donatorsMail)
            .subscribe((data) => {
                this.donators = data.content;
                this.totalElements = data.totalElements;
            });
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getAll();
    }

    openPersonalBonusDialog(donatorId: number): void {
        const dialogRef = this.dialog.open(DonatorBonusDialogComponent, {
            width: '50%',
            data: {donatorId: donatorId, servers: this.servers},
        });
        dialogRef.componentInstance.response.subscribe(() => {
            this.getAll();
        });
    }

    createDonatorDialog(): void {
        const dialogRef = this.dialog.open(CreateDonatorDialogComponent, {
            width: '50%',
            data: {}
        });
        dialogRef.componentInstance.response.subscribe(() => {
            this.getAll();
        });
    }
}
