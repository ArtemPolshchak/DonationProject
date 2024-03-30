import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthService} from "./services/auth.service";


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        SidebarComponent,
        RouterOutlet,
        NgIf,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

    constructor(public authService: AuthService,
                private router: Router) {}

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigateByUrl("/login")
        }
    }
}
