import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SetupBonusDialogComponent} from "./setup-bonus-dialog/setup-bonus-dialog.component";
import {DonatorBonus} from "../../common/donatorBonus";
import {ServerService} from "../../services/server.service";
import {HttpEventType} from "@angular/common/http";

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
  donatorBonus: DonatorBonus[] = [];
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  selectedItem: any;
  donatorsMail?: string;
  sortState?: string = "email,asc";
  serverId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private serverService: ServerService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute
  ) {

    this.route.params.subscribe(params => {
      this.serverId =  +params['id'];
    });
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
    this.search();
  }

  search(): void {
    this.serverService.searchDonatorsByEmailContains(this.serverId, this.donatorsMail, this.pageNumber, this.pageSize, this.sortState)
        .subscribe((data) => {
            this.donatorBonus = data.content;
            this.totalElements = data.totalElements;
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
      this.search();
    }
  }

  openSetupBonusDialog(donatorId: number): void {
    const dialogRef = this.dialog.open(SetupBonusDialogComponent, {
      width: '50%',
      data: {
        serverId: this.serverId,
        donatorId: donatorId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.search();
    });
  }
}
