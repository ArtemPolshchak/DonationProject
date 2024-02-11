import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../services/auth.service";
import {ADMIN_MENU_ITEMS, MODERATOR_MENU_ITEMS} from "../../enums/app-constans";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgbNavModule,
    NgForOf,
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  menuItems: string[] = [];

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.menuItems = this.authService.isAdmin() ? ADMIN_MENU_ITEMS : MODERATOR_MENU_ITEMS;
  }
}
