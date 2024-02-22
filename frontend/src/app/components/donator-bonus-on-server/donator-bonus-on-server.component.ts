import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf} from "@angular/common";
import {Donator} from "../../common/donator";
import {DonatorService} from "../../services/donator.service";
import {Router} from "@angular/router";
import {
  CreateTransactionDialog
} from "../donations/donations.dialog/create.transaction/create-transaction-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SetupBonusDialogComponent} from "./setup-bonus-dialog/setup-bonus-dialog.component";

@Component({
  selector: 'app-donator-bonus-on-server',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    MatPaginator,
    NgForOf
  ],
  templateUrl: 'donator-bonus-on-server.component.html',
  styleUrl: './donator-bonus-on-server.component.scss'
})
export class DonatorBonusOnServer implements OnInit {
  donators: Donator[] = [];
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  selectedItem: any;
  donatorsMail?: string;
  sortState?: string = "totalDonations,desc";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private donatorService: DonatorService,
              private router: Router,
              private dialog: MatDialog,
              private _formBuilder: FormBuilder) {
  }

  goToDonatorStory(donatorId: number, email: string, totalDonations: number | undefined): void {
    if (typeof totalDonations !== 'undefined') {
      this.router.navigate(['/donatorstory', donatorId, email, totalDonations]);
    } else {
      console.error('Total donations is undefined.');
    }
  }

  goToServers(): void {
    this.router.navigate(['/servers']);
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

  openSetupBonusDialog(): void {
    const dialogRef = this.dialog.open(SetupBonusDialogComponent, {
      width: '50%',

    });
  }
}