import {Component, OnInit} from '@angular/core';
import {ServerService} from "../../services/server.service";
import {Server} from "../../common/server";
import {NgClass, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AddNewServerDialogComponent} from "./add-new-server-dialog/add-new-server-dialog.component";
import {ServerBonusComponent} from "./server-bonus-dialog/server-bonus.component";
import {Router} from "@angular/router";
import {SetupServerDialogComponent} from "./setup-server-dialog/setup-server-dialog.component";
import {MatButton} from "@angular/material/button";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatFooterRow} from "@angular/material/table";
import {ToasterService} from "../../services/toaster.service";
import {StorageService} from "../../services/storage.service";

@Component({
    selector: 'app-server',
    standalone: true,
    imports: [
        NgForOf,
        NgClass,
        MatButton,
        MatPaginator,
        MatFooterRow
    ],
    templateUrl: './server.component.html',
    styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
    servers: Server[] = [];
    selectedServerId: number = 0;
    isButtonDisabled: boolean = true;
    pageNumber: number = 0;
    totalElements: number = 0;
    pageSize: number = 6;
    sortState: string = "asc";

    constructor(
        private toasterService: ToasterService,
        private serverService: ServerService,
        private dialog: MatDialog,
        private router: Router) {
    }

    ngOnInit(): void {
        this.servers = StorageService.getServers();
        this.totalElements = this.servers.length;
    }

    getAllServers(): void {
        this.serverService.getAll(this.pageNumber, this.pageSize, this.sortState)
            .subscribe(data => {
                StorageService.addServers(JSON.stringify(data.content));
                this.servers = data.content;
                this.totalElements = data.totalElements;
            })
    }

    openAddServerDialog(): void {
        const dialogRef = this.dialog.open(AddNewServerDialogComponent, {
            width: '50%',
        });
        dialogRef.componentInstance.componentResponse.subscribe(() => {
            this.getAllServers()
        });
    }

    openUpdateServerDialog(serverId: number): void {
        const dialogRef = this.dialog.open(SetupServerDialogComponent, {
            width: '50%',
            data: {
                serverId: serverId
            }
        });
        dialogRef.componentInstance.componentResponse.subscribe(() => {
            this.getAllServers()
        });
    }

    openServerBonusDialog(serverId: number): void {
        this.dialog.open(ServerBonusComponent, {
            width: '50%',
            data: {
                serverId: serverId
            }
        });
    }

    goToDonatorBonusOnServer(server: Server): void {
        this.router.navigate(['./donator-bonus-on-server', server.id, {
            serverName: server.serverName,
        }]);
    }

    updateButtonStatus(): void {
        this.isButtonDisabled = this.selectedServerId === 0;
    }

    handleRadioChange(serverId: number): void {
        this.selectedServerId = serverId;
        this.updateButtonStatus();
    }

    handleServerClick(serverId: number): void {
        if (this.selectedServerId === serverId) {
            this.selectedServerId = 0;
            this.updateButtonStatus();
        }
    }

    removeServer(serverId: number): void {
        this.serverService.deleteServerById(serverId).subscribe({
            next: () => {
                this.getAllServers();
                this.openSnackBar("Сервер успешно удален")
            },
            error: (err) => this.openSnackBar("Ошибка при удалении сервера: " + err.message),
        });
    }

    onPageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageNumber = event.pageIndex;
        this.getAllServers();
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}
