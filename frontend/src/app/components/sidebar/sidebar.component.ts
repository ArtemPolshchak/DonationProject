import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {KeyValuePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../services/auth.service";
import {ADMIN_MENU_ITEMS, MODERATOR_MENU_ITEMS} from "../../enums/app-constans";
import {MatButtonModule} from "@angular/material/button";
import {StorageService} from "../../services/storage.service";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCheckbox} from "@angular/material/checkbox";
import {ToasterService} from "../../services/toaster.service";

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
        MatFormFieldModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSidenavModule,
        KeyValuePipe,
        MatCheckbox
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    menuItems: { [key: string]: string } = {};

    constructor(public authService: AuthService,
                private router: Router,
                private toaster: ToasterService) {
    }

    ngOnInit(): void {
        this.menuItems = this.setMenuItems();
        StorageService.watchToken().subscribe({
            next: () => {
                this.menuItems = this.setMenuItems();
            },
            error: (err) => {
                this.toaster.openSnackBar("Unauthorized!")
                this.router.navigateByUrl("/login")
            }
        })
    }

    private setMenuItems() {
        return this.authService.isAdmin() ? ADMIN_MENU_ITEMS :
            this.authService.isModerator() ? MODERATOR_MENU_ITEMS : {};
    }

    logout(): void {
        StorageService.clear();
        this.router.navigateByUrl('/login');
    }
}
