import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../services/auth.service";
import {ADMIN_MENU_ITEMS, MODERATOR_MENU_ITEMS} from "../../enums/app-constans";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatButton} from "@angular/material/button";
import {StorageService} from "../../services/storage.service";

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
    MatButtonToggleGroup,
    MatButton,
    KeyValuePipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  menuItems: { [key: string]: string } = {};

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.menuItems = this.authService.isAdmin() ? ADMIN_MENU_ITEMS : MODERATOR_MENU_ITEMS;
  }

  logout(): void {
    StorageService.clear();
    this.router.navigateByUrl('/login');
  }
}
