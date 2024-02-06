import {Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {TransactionComponent} from "./components/transaction/transaction.component";
import {DonatorsComponent} from "./components/donators/donators.component";
import {ServerComponent} from "./components/server/server.component";
import {UserComponent} from "./components/user/user.component";
import {LoginComponent} from "./components/login/login.component";

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: "full"},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'donations', component: TransactionComponent},
    {path: 'donators', component: DonatorsComponent},
    {path: 'servers', component: ServerComponent},
    {path: 'users', component: UserComponent}

];
