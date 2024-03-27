import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
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
import {CreateServerDto, ServerService} from "../../../services/server.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../../services/storage.service";
import {HttpEventType} from "@angular/common/http";

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
    templateUrl: './add-new-server-dialog.component.html',
    styleUrl: './add-new-server-dialog.component.scss'
})
export class AddNewServerDialogComponent {
    servers: Server[];
    durationInSeconds: number = 5;
    @Output() componentResponse = new EventEmitter();

    constructor(
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<AddNewServerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private serverService: ServerService) {
        this.servers = data;
    }

    serverNameControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^\S+$/)
        ]
    );
    serverUrlControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^\S+$/)
        ] // Перевірка правильності формату URL
    );
    serverUserNameControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^\S+$/)
        ]
    );
    serverPasswordControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^\S+$/)
        ]
    );

    addNewServer() {
        if (this.isFormValid()) {
            const newServer: CreateServerDto = {
                serverName: this.serverNameControl.value!,
                serverUrl: this.serverUrlControl.value!,
                serverUserName: this.serverUserNameControl.value!,
                serverPassword: this.serverPasswordControl.value!,
            };

            this.serverService.create(newServer).subscribe({
                    next: (result) => {
                        this.componentResponse.emit(result)
                        this.getServerList();
                        this.dialogRef.close();
                        this.openSnackBar("Сервер успешно добавлен")
                    },
                    error: (err) => this.openSnackBar("Ошибка при добавлении сервера: " + err.message),
                },
            );
        }
    }


    private getServerList(): void {
        this.serverService.getAllServerNames().subscribe({
            next: (data) => {
                    StorageService.addItem('servers', JSON.stringify(data.content));
            },
            error: (e) => console.error(e),
        });
    }


    isFormValid() {
        return this.serverNameControl.valid
            && this.serverUrlControl.valid
            && this.serverUserNameControl.valid
            && this.serverPasswordControl.valid;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Закрыть', {
            duration: this.durationInSeconds * 1000,
        });
    }
}

export interface DialogData {
    serverName: string;
    serverUrl: string;
    serverUserName: string;
    serverPassword: string;
}
