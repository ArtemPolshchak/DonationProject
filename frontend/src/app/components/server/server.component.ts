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


@Component({
  selector: 'app-server',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    MatButton
  ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
  servers: Server[] = [];
  selectedServerId: number | null = null;
  isButtonDisabled: boolean = true;
  durationInSeconds: number = 5;

  constructor(
      private _snackBar: MatSnackBar,
      private serverService: ServerService,
      private dialog: MatDialog,
      private router: Router) {
  }

  ngOnInit(): void {
    this.getAllServers();

    // const serversFromStorage = sessionStorage.getItem('servers');
    // if (serversFromStorage) {
    //   this.servers = JSON.parse(serversFromStorage);
    // }
  }

  getAllServers(): void {
    this.serverService.getAll()
        .subscribe(data => {
          this.servers = data.content
        })
  }

  openAddServerDialog(): void {
    const dialogRef = this.dialog.open(AddNewServerDialogComponent, {
      width: '50%',
    });
    dialogRef.componentInstance.serverResponse.subscribe( () => {
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

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('Dialog result:', result);
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
}
