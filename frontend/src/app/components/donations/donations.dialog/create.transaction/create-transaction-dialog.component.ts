import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {Transaction} from "../../../../common/transaction";
import {FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators} from "@angular/forms";
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
import {Server} from "../../../../common/server";
import {MatIcon} from "@angular/material/icon";

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
        MatIcon,
    ],
    templateUrl: './create-transaction-dialog.component.html',
    styleUrl: './create-transaction-dialog.component.scss'
})
export class CreateTransactionDialog {
    servers: Server[];
    transaction: Transaction = new Transaction();
    serverControl = new FormControl<Server | null>(null, Validators.required);
    contributionControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/\d/)]
    )
    emailControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    )
    editForm = this.fb.group({
        photo: [],
    });

    constructor(private fb: UntypedFormBuilder,
                private transactionService: TransactionService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.servers = data;
    }

    isFormValid() {
        return this.serverControl.valid && this.contributionControl.valid && this.emailControl.valid;
    }

    saveImage(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target?.files) {
            const file: File= target.files?.[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.editForm.get('photo')?.setValue(reader.result as string);
                this.transaction.image = reader.result as string;
                console.log(this.transaction.image);
            });
            reader.readAsDataURL(file);
        }
    }

    removeImage() {
        this.editForm.get('photo')?.setValue(null);
        this.transaction.image = "";
    }

    createTransaction() {
        this.transaction.serverId = this.serverControl.value!.id
        this.transaction.contributionAmount = Number(this.contributionControl.value!);
        this.transaction.donatorEmail = this.emailControl.value!;
        console.log(this.transaction);
        this.transactionService.create(this.transaction).subscribe();
    }

    protected readonly HTMLInputElement = HTMLInputElement;
}
