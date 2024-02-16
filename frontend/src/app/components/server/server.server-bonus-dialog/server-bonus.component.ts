import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {MatCard, MatCardContent} from "@angular/material/card";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-server-bonus',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,

    MatLabel,
    MatInput,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatOption,
    MatSelect,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './server-bonus.component.html',
  styleUrl: './server-bonus.component.scss'
})
export class ServerBonusComponent {
  deleteBonus: any;
  addBonus: any;
  saveBonus: any;


  constructor(
      public dialogRef: MatDialogRef<ServerBonusComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
