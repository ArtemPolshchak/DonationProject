import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {Router, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {StorageService} from "./services/storage.service";
import {User} from "./common/user";
import {Roles} from "./enums/app-constans";

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
export class AppComponent implements OnInit{

    constructor(private storageService: StorageService, private router: Router) {
    }

    ngOnInit(): void {
       if (!this.storageService.getUser()) {
           this.router.navigateByUrl("/login")
       }
    }

    public isAdmin(): boolean {
        console.log(this.storageService.getUser()?.role)
        console.log("this.storageService.getUser()?.role")
        return Roles.ADMIN === this.storageService.getUser()?.role;
    }

    public isModerator(): boolean {
        return Roles.MODERATOR == this.storageService.getUser()?.role;
    }

    public isGuest(): boolean {
        return Roles.GUEST == this.storageService.getUser()?.role;
    }
}
