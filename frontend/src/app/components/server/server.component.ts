import {Component, OnInit} from '@angular/core';
import {ServerService} from "../../services/server.service";
import {Server} from "../../common/server";
import {NgForOf} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ServerDialogComponent} from "./server.dialog/server.dialog.component";


@Component({
  selector: 'app-server',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
  servers: Server[] = [];

  constructor(private serverService: ServerService,
              private dialog: MatDialog,) {
  }



  ngOnInit(): void {
    this.serverService.getAll()
        .subscribe(data => {
          this.servers = data.content
        })

    // const serversFromStorage = sessionStorage.getItem('servers');
    // if (serversFromStorage) {
    //   this.servers = JSON.parse(serversFromStorage);
    // }
  }

  openAddServerDialog(): void {
    this.dialog.open(ServerDialogComponent, {
      width: '50%',
    });
  }

}
