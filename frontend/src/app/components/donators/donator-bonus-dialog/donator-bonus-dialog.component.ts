import {Component, EventEmitter, Inject} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {Server} from "../../../common/server";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ServerService} from "../../../services/server.service";
import {ToasterService} from "../../../services/toaster.service";


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
    servers: Server[];
    donatorId: number;
    response = new EventEmitter()
    serverControl = new FormControl<Server | null>(null, Validators.required);
    contributionControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/\d/)
    ]);

    constructor(
        private serverService: ServerService,
        private toasterService: ToasterService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.servers = data.servers;
        this.donatorId = data.donatorId;
    }

    isFormValid() {
        return this.serverControl.valid && this.contributionControl.valid;
    }

    setupBonus() {
        let personalBonus = Number(this.contributionControl.value!);
        this.serverService.createDonatorsBonusOnServer(this.serverControl.value!.id,
            this.donatorId, {personalBonus: personalBonus}).subscribe({
            next: (response) => {
                this.openSnackBar("Бонус успешно добавлен")
                this.response.emit(response);
            },
            error: (err) => this.openSnackBar("Ошибка при создании бонуса: " + err.message)
        });
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}
