import {Component} from '@angular/core';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
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
export class AppComponent {
    active = 'dashboard';
}
