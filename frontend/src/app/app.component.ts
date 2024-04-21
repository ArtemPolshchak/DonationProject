import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "./services/auth.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MediaMatcher} from "@angular/cdk/layout";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {ServerService} from "./services/server.service";
import {SidebarComponent} from "./components/sidebar/sidebar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgIf,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        KeyValuePipe,
        MatButtonToggle,
        MatButtonToggleGroup,
        NgForOf,
        RouterLink,
        SidebarComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
                public authService: AuthService,
                public serverService: ServerService,
                private router: Router) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigateByUrl("/login")
        }
    }
}
