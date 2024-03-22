
import {Component, HostListener, Inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {Server} from "../../../common/server";
import {Transaction} from "../../../common/transaction";
import {TransactionService} from "../../../services/transaction.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Donator} from "../../../common/donator";
import {DonatorBonus} from "../../../common/donatorBonus";
import {ServerService} from "../../../services/server.service";
import {CreateDonatorBonus} from "../../../common/create-donator-bonus";



@Component({
  selector: 'app-donator-bonus-dialog',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatCard,
        MatCardContent,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],

  templateUrl: './donator-bonus-dialog.component.html',
  styleUrl: './donator-bonus-dialog.component.scss'
})
export class DonatorBonusDialogComponent {

    durationInSeconds: number = 5;
    donator: CreateDonatorBonus = new CreateDonatorBonus();
    servers: Server[];
    email: string = "";
    serverControl = new FormControl<Server | null>(null, Validators.required);
    contributionControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/\d/)
    ]);

    constructor(
        private fb: UntypedFormBuilder,
        private serverService: ServerService,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.servers = data.servers;
        this.email = data.email;
    }

    isFormValid() {
        return this.serverControl.valid && this.contributionControl.valid;
    }

    setupBonus() {
        this.donator.serverId = this.serverControl.value!.id;
        this.donator.email = this.email;
        this.donator.personalBonus = Number(this.contributionControl.value!);

        this.serverService.createDonatorsBonusOnServer(this.donator).subscribe({
            next: () => this.openSnackBar("Бонус успешно добавлен"),
            error: (err) => this.openSnackBar("Ошибка при создании бонуса: " + err.message)
        });
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Закрыть', {
            duration: this.durationInSeconds * 1000,
        });
    }
}
