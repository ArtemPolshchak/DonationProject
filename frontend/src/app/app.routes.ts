import {Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {TransactionComponent} from "./components/transaction/transaction.component";

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'transactions', component: TransactionComponent}
];
