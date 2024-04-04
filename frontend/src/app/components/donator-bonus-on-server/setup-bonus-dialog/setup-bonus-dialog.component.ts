import {Component, Inject, OnInit} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from "@angular/material/dialog";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {ServerService} from "../../../services/server.service";
import {LoadDonatorBonus} from "../../../common/load-donator-bonus";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToasterService} from "../../../services/toaster.service";

@Component({
    selector: 'app-setup-bonus-dialog',
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
    templateUrl: './setup-bonus-dialog.component.html',
    styleUrl: './setup-bonus-dialog.component.scss'
})
export class SetupBonusDialogComponent implements OnInit {
    personalBonus: number = 0;
    updateDonatorBonus!: LoadDonatorBonus;
    durationInSeconds: number = 5;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<SetupBonusDialogComponent>,
        private toasterService: ToasterService,
    ) {
    }

    isFormValid() {
        return (
            this.contributionControl.valid
        );
    }

    ngOnInit(): void {
        console.log('Server ID:', this.data.serverId);
        console.log('Donator ID:', this.data.donatorId);
    }

    saveBonus(): void {
        const inputValue: string | null = this.contributionControl.value;
        if (inputValue !== null && !isNaN(parseFloat(inputValue))) {
            this.personalBonus = parseFloat(inputValue);
            this.serverService.updateDonatorsBonusOnServer(
                this.data.serverId, this.data.donatorId, {personalBonus: this.personalBonus})
                .subscribe({
                    next: () => {
                        this.dialogRef.close()
                        this.openSnackBar("Бонус успешно изменен")
                    },
                    error: (error) => {
                        this.openSnackBar("Произошла ошибка")
                        console.error('Error updating bonus', error);
                    }
                });
        } else {
            this.openSnackBar("Произошла ошибка")
            console.error('Input value is not a valid number');
        }
    }

    contributionControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d*\.?\d*$/)
    ]);

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}

