import {Component, EventEmitter, Inject, Output} from '@angular/core';
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
import {NgIf} from "@angular/common";
import {DonatorService} from "../../../services/donator.service";
import {ToasterService} from "../../../services/toaster.service";

@Component({
    selector: 'app-create-donator-dialog',
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
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './create-donator-dialog.component.html',
    styleUrl: './create-donator-dialog.component.scss'
})
export class CreateDonatorDialogComponent {
    email!: string;
    @Output() response = new EventEmitter();
    emailControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    );

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private donatorService: DonatorService,
        private dialogRef: MatDialogRef<CreateDonatorDialogComponent>,
        private toasterService: ToasterService,
    ) {
    }

    createDonator(): void {
        this.donatorService.createDonator({email: this.email}).subscribe({
            next: (response) => {
                this.response.emit(response);
                this.openSnackBar("Донатор успешно добавлен");
            },
            error: () => this.openSnackBar("Произошла ошибка при добавления Донатора"),
            complete: () => this.dialogRef.close()
        });
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}
