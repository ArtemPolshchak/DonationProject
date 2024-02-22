import {Component, OnInit} from '@angular/core';
import {ServerService} from "../../services/server.service";
import {Server} from "../../common/server";
import {NgClass, NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AddNewServerDialogComponent} from "./server.add-new-server-dialog/add-new-server-dialog.component";
import {ServerBonusComponent} from "./server.server-bonus-dialog/server-bonus.component";
import {Router} from "@angular/router";


@Component({
  selector: 'app-server',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
  servers: Server[] = [];
  selectedServerId: number | null = null;
  isButtonDisabled: boolean = true;

  constructor(
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
    this.dialog.open(AddNewServerDialogComponent, {
      width: '50%',
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


  goToDonatorBonusOnServer(): void {
      this.router.navigate(['./donator-bonus-on-server']);

  }

  updateButtonStatus(): void {
    this.isButtonDisabled = this.selectedServerId === null;
  }

  handleRemoveServerClick(): void {
    this.openAddServerDialog();
  }

  handleSettingsServerClick(): void {
    this.openAddServerDialog();
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
}
