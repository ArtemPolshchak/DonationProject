import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgbNavModule,
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems: string[] = ['login', 'dashboard', 'donations', 'donators', 'users',  'servers', 'settings'];
}
