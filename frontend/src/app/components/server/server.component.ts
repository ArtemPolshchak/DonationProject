import {Component, OnInit} from '@angular/core';
import {ServerService} from "../../services/server.service";
import {Server} from "../../common/server";
import {NgForOf} from "@angular/common";

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

  constructor(private serverService: ServerService) {
  }

  ngOnInit(): void {
    this.serverService.getAll()
        .subscribe(data => {
          this.servers = data.content
        })
  }

}
