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
import {ServerService} from "../../../../services/server.service";
import {ToasterService} from "../../../../services/toaster.service";
import {DonatorBonus} from "../../../../common/donatorBonus";

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
    donator!: DonatorBonus;
    serverId!: number;
    contributionControl = new FormControl(0, [
        Validators.required,
        Validators.pattern(/^\d*\.?\d*$/)
    ]);


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<SetupBonusDialogComponent>,
        private toasterService: ToasterService,
    ) {
        this.donator = data.donator;
        this.serverId = data.serverId;
    }

    isFormValid() {
        return (
            this.contributionControl.valid
        );
    }

    ngOnInit(): void {
        if (this.data.donator) {
            this.contributionControl.setValue(this.data.donator.personalBonus)
        }
    }

    saveBonus(): void {
        this.serverService.updateDonatorsBonusOnServer(
            this.serverId, this.donator.id, {personalBonus: Number(this.contributionControl.value!)})
            .subscribe({
                next: () => {
                    this.openSnackBar("Бонус успешно изменен")
                },
                error: (error) => {
                    this.openSnackBar("Произошла ошибка")
                },
                complete: () => this.dialogRef.close()
            });
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}

