import {Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DonationsComponent} from "./components/donations/donations.component";
import {DonatorsComponent} from "./components/donators/donators.component";
import {ServerComponent} from "./components/server/server.component";
import {UserComponent} from "./components/user/user.component";
import {LoginComponent} from "./components/login/login.component";
import {hasRoleGuard} from "./services/auth.service";
import {Role} from "./enums/role";
import {DonatorstoryComponent} from "./components/donatorstory/donatorstory.component";
import {DonatorBonusOnServer} from "./components/donator-bonus-on-server/donator-bonus-on-server.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {GuestPageComponent} from "./components/guest-page/guest-page.component";

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: "full", },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'donations',
        component: DonationsComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR ]
        }},
    {
        path: 'donators',
        component: DonatorsComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'donatorstory/:id/:email/:totalDonations',
        component: DonatorstoryComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'donator-bonus-on-server/:id',
        component: DonatorBonusOnServer,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'servers',
        component: ServerComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'users',
        component: UserComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'app-guest-page',
        component: GuestPageComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [Role.ADMIN, Role.MODERATOR, Role.GUEST ]
        }
    },
    { path: '**', component: PageNotFoundComponent }
];
