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
import {HttpEventType} from "@angular/common/http";


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
    pageSize: number = 5;
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

    goToDonatorStory(donatorId: number, email: string, totalDonations: number | undefined): void {
        if (typeof totalDonations !== 'undefined') {
            this.router.navigate(['/donatorstory', donatorId, email, totalDonations]);
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

    ngOnInit(): void {
        this.getAll()
        const serversData = StorageService.getItem('servers');
        if (serversData) {
            this.servers = JSON.parse(serversData);
        }
    }

    getAll(): void {
        this.donatorService.getAll(this.pageNumber, this.pageSize, this.sortState)
            .subscribe((data) => {
                    this.donators = data.content;
                    this.totalElements = data.totalElements;
            });
    }

    sort(sortField: string) {
        this.sortOrder = this.sortOrder === this.descOrder ? this.ascOrder : this.descOrder;
        this.sortState = sortField + ',' + this.sortOrder;
        this.getAll();
    }

    search(): void {
        this.sortState = this.defaultSortField + ',' + this.sortOrder;
        this.donatorService.search(this.donatorsMail, this.pageNumber, this.pageSize, this.sortState)
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

    applySearch(): void {
        if (this.donatorsMail && this.donatorsMail.trim() !== '') {
            this.search();
        } else {
            this.getAll();
        }
    }

    openPersonalBonusDialog(donatorId: number): void {

        const dialogRef = this.dialog.open(DonatorBonusDialogComponent, {
            width: '50%',
            data: {donatorId: donatorId, servers: this.servers},
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getAll();
        });
    }

    createDonatorDialog(): void {

        const dialogRef = this.dialog.open(CreateDonatorDialogComponent, {
            width: '50%',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}