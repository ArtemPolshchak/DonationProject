import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {Server} from "../../../common/server";




@Component({
  selector: 'app-server.dialog',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    FormsModule,
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
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './server.dialog.component.html',
  styleUrl: './server.dialog.component.scss'
})
export class ServerDialogComponent {
  servers: Server[];

  constructor(
      public dialogRef: MatDialogRef<ServerDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
    this.servers = data;
  }

  databaseControl = new FormControl('',
      [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
  )

  emailControl = new FormControl('',
      [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
  )

  passwordControl = new FormControl('',
      [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
  )

  serverControl = new FormControl<Server | null>(null, Validators.required);

  usernameControl = new FormControl('',
      [Validators.required,
        Validators.pattern(/\d/)]
  )

  isFormValid(){
    return this.serverControl.valid && this.usernameControl.valid && this.databaseControl.valid && this.passwordControl.valid;
  }

  addNewServer() {
    console.log();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


export interface DialogData {
  name: string;
  url: string;
  username: string;
  database: string;
  password: string;
}