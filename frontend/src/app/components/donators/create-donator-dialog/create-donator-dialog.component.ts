import {Component, Inject, OnInit} from '@angular/core';
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
import {LoadDonatorBonus} from "../../../common/load-donator-bonus";
import {CreateServerDto, ServerService} from "../../../services/server.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateDonator, DonatorService} from "../../../services/donator.service";

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
export class CreateDonatorDialogComponent implements OnInit {
  email!: string;
  updateDonatorBonus!: LoadDonatorBonus;
  durationInSeconds: number = 5;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private donatorService: DonatorService,
      private dialogRef: MatDialogRef<CreateDonatorDialogComponent>,
      private _snackBar: MatSnackBar,
  ) {}

  isFormValid() {
    return (
        this.emailControl.valid
    );
  }

  ngOnInit(): void {
    console.log('Server ID:', this.data.serverId);
    console.log('Donator ID:', this.data.donatorId);
  }

  createDonator(): void {
    const inputValue: string | null = this.emailControl.value;

    if (inputValue !== null) {
      this.email = inputValue;
      const newDonator: CreateDonator = {
        email: this.email
      };
      this.donatorService.createDonator(newDonator).subscribe(
          (response) => {
            console.log('Donator created successfully:', response);
            this.dialogRef.close();
            this.openSnackBar("Донатор успешно добавлен");
          },
          (error) => {
            this.openSnackBar("Произошла ошибка при добавления Донатора");
            console.error('Error creating server:', error);
          }
      );
    }
  }


  emailControl = new FormControl('',
    [Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
  );

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Закрыть', {
      duration: this.durationInSeconds * 1000,
    });
  }
}
