import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        SidebarComponent,
        RouterOutlet,
        NgIf
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    active = 'dashboard';
}
