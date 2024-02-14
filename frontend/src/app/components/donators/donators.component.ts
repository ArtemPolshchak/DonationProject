import {Component, OnInit, ViewChild} from '@angular/core';
import {DonatorService} from "../../services/donator.service";
import {Donator} from "../../common/donator";
import {NgForOf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";

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
  ],
  templateUrl: './donators.component.html',
  styleUrl: './donators.component.scss'
})
export class DonatorsComponent implements OnInit {

  donators: Donator[] = [];
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  selectedItem: any;
  donatorsMail?: string;
  sortState?: string = "totalDonations,desc";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private donatorService: DonatorService,
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
    this.getDonatorsPage();

  }

  getDonatorsPage(): void {
    this.getAll()

  }

    getAll(): void {
        this.donatorService.getAll(this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.donators = response.content;
                this.totalElements = response.totalElements;
                console.log("donators" + this.donators.length);
                console.log("totalElements" + this.totalElements);
            });
    }

    search(): void {
        this.donatorService.search(this.donatorsMail, this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.donators = response.content;
                this.totalElements = response.totalElements;
                console.log("donators" + this.donators.length);
                console.log("totalElements" + this.totalElements);
            });
    }



    onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getDonatorsPage();
  }

    applySearch(): void {
        if (this.donatorsMail && this.donatorsMail.trim() !== '') {
            this.search();
        } else {
            this.getAll();
        }
    }
}