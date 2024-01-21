import { Component } from '@angular/core';
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  items: string[] = ['first', 'second', 'third']
}
