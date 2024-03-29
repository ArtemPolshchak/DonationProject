import {Component, OnInit} from '@angular/core';
import {ServerService} from "../../services/server.service";
import {Server} from "../../common/server";
import {NgClass, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AddNewServerDialogComponent} from "./server.add-new-server-dialog/add-new-server-dialog.component";
import {ServerBonusComponent} from "./server.server-bonus-dialog/server-bonus.component";
import {Router} from "@angular/router";
import {SetupServerDialogComponent} from "./setup-server-dialog/setup-server-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButton} from "@angular/material/button";
import {HttpEventType} from "@angular/common/http";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    MatButton,
    MatPaginator
  ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
  servers: Server[] = [];
  selectedServerId: number | null = null;
  isButtonDisabled: boolean = true;
  durationInSeconds: number = 5;
  pageNumber: number = 0;
  totalElements: number = 0;
  pageSize: number = 6;
  sortState: string = "asc";

  constructor(
      private _snackBar: MatSnackBar,
      private serverService: ServerService,
      private dialog: MatDialog,
      private router: Router) {
  }

  ngOnInit(): void {
    this.getAllServers();
  }

  getAllServers(): void {
    this.serverService.getAllServerNames(this.pageNumber, this.pageSize, this.sortState)
        .subscribe(data => {
            this.servers = data.content;
            this.totalElements = data.totalElements;
        })
  }

  openAddServerDialog(): void {
    const dialogRef = this.dialog.open(AddNewServerDialogComponent, {
      width: '50%',
    });
    dialogRef.componentInstance.componentResponse.subscribe( () => {
      this.getAllServers()
    });
  }

  openServerBonusDialog(serverId: number): void {
    const dialogRef = this.dialog.open(ServerBonusComponent, {
      width: '50%',
      data: {
        serverId: serverId
      }
    });
    dialogRef.componentInstance.componentResponse.subscribe( () => {
      this.getAllServers()
    });
  }


  goToDonatorBonusOnServer(serverId: number): void {
    this.router.navigate(['./donator-bonus-on-server', serverId]);
  }

  updateButtonStatus(): void {
    this.isButtonDisabled = this.selectedServerId === null;
  }

  removeServer(): void {
    this.openSnackBar("Удаление Сервера еще не реализовано")
  }

  openSetUpServerDialog(): void {
    this.dialog.open(SetupServerDialogComponent, {
      width: '50%',
    });
  }

  handleRadioChange(serverId: number): void {
    this.selectedServerId = serverId;
    this.updateButtonStatus();
  }

  handleServerClick(serverId: number): void {
    if (this.selectedServerId === serverId) {
      this.selectedServerId = null;
      this.updateButtonStatus();
    }
  }


  openSnackBar(message: string) {
    this._snackBar.open(message, 'Закрыть', {
      duration: this.durationInSeconds * 1000,
    });
  }

  onPageChange(event: PageEvent) {
      this.pageSize = event.pageSize;
      this.pageNumber = event.pageIndex;
      this.getAllServers();
  }
}
