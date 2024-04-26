import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SetupBonusDialogComponent} from "./setup-bonus-dialog/setup-bonus-dialog.component";
import {DonatorBonus} from "../../../common/donatorBonus";
import {ServerService} from "../../../services/server.service";
import {ToasterService} from "../../../services/toaster.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";

@Component({
    selector: 'app-donator-bonus-on-server',
    standalone: true,
    imports: [
        FormsModule,
        MatInput,
        MatPaginator,
        NgForOf,
        MatIcon,
        MatMiniFabButton,
        MatIconButton,
        NgIf
    ],
    templateUrl: './donator-bonus-on-server.component.html',
    styleUrl: './donator-bonus-on-server.component.scss'
})
export class DonatorBonusOnServer implements OnInit {
    donatorBonuses: DonatorBonus[] = [];
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;
    donatorMails?: string;
    ascOrder: string = "asc";
    descOrder: string = "desc";
    defaultSortField: string = "email"
    sortOrder: string = this.descOrder;
    sortState: string = this.defaultSortField + ',' + this.sortOrder;
    serverId!: number;
    serverName!: string;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private serverService: ServerService,
                private toasterService: ToasterService,
                private router: Router,
                private dialog: MatDialog,
                private route: ActivatedRoute
    ) {

        this.route.params.subscribe(params => {
            this.serverId = +params['id'];
            this.serverName = params['serverName'];
        });
    }

    goToServers(): void {
        this.router.navigate(['/servers']);
    }

    ngOnInit(): void {
        this.search()
    }

    search(): void {
        this.serverService.searchDonatorsByEmailContains(
            this.serverId, this.donatorMails, this.pageNumber, this.pageSize, this.sortState)
            .subscribe((data) => {
                this.donatorBonuses = data.content;
                this.totalElements = data.totalElements;
            });
    }

    goToDonatorStory(donatorId: number, donatoorEmail: string, serverName: number): void {
            this.router.navigate(['/donator-story', donatorId, {
                email: donatoorEmail,
                serverName: serverName,
            }]);
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.search();
    }

    applySearch(): void {
        this.search();
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }

    openSetupBonusDialog(donator: DonatorBonus): void {
        const dialogRef = this.dialog.open(SetupBonusDialogComponent, {
            width: '50%',
            data: {
                serverId: this.serverId,
                donator: donator,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.search();
        });
    }

    sort(sortField: string) {
        this.sortOrder = this.sortOrder === this.descOrder ? this.ascOrder : this.descOrder;
        this.sortState = `${sortField},${this.sortOrder}`;
        this.search();
    }
}
