import {Component} from '@angular/core';
import {MatDialogModule} from "@angular/material/dialog";
import {Transaction} from "../../../../common/transaction";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatOption, MatSelect} from "@angular/material/select";
import {TransactionService} from "../../../../services/transaction.service";


@Component({
    selector: 'app-create-transaction-dialog',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatButtonToggleModule,
        MatCardModule,
        MatTableModule,
        MatGridListModule,
        MatSelect,
        MatOption,
    ],
    templateUrl: './create-transaction-dialog.component.html',
    styleUrl: './create-transaction-dialog.component.scss'
})
export class CreateTransactionDialog {
    servers: string[] = ['1', "2", "3", "4"];
    transaction: Transaction = new Transaction();
    serverControl = new FormControl('', Validators.required);
    contributionControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/\d/)]
    )
    emailControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    )

    constructor(private transactionService: TransactionService) {
    }

    createTransaction() {
        this.transaction.serverId = Number(this.serverControl.value!);
        this.transaction.contributionAmount = Number(this.contributionControl.value!);
        this.transaction.donatorEmail = this.emailControl.value!;
        console.log(this.transaction);
        this.transactionService.create(this.transaction).subscribe();
    }
}
