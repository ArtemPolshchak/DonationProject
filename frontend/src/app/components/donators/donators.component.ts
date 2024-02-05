import {Component, OnInit} from '@angular/core';
import {DonatorService} from "../../services/donator.service";
import {Donator} from "../../common/donator";
import {NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

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
  ],
  templateUrl: './donators.component.html',
  styleUrl: './donators.component.scss'
})
export class DonatorsComponent implements OnInit {

  donators: Donator[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  selectedItem: any;

  constructor(private donatorService: DonatorService) {
  }


  handleClick($event: any) {
    $event.stopPropagation();
  }

  select(item: any) {
    this.selectedItem = item;
  }

  ngOnInit(): void {
    this.donatorService.getAll(this.pageNumber, this.pageSize)
        .subscribe(data => {
          this.donators = data.content
          console.log(this.donators)
        })
  }
}