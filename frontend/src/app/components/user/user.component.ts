import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {Donator} from "../../common/donator";
import {User} from "../../common/user";
import {DonatorService} from "../../services/donator.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user',
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
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: User[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  selectedItem: any;

  constructor(private userService: UserService) {
  }
  ngOnInit(): void {
    this.userService.getAll(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.users = data.content
          console.log(this.users)
        })
  }

}
