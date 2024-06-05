import {Component, EventEmitter, Output} from '@angular/core';
import {
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
import {ServerDto, ServerService} from "../../../services/server.service";
import {StorageService} from "../../../services/storage.service";
import {ToasterService} from "../../../services/toaster.service";
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
        private toasterService: ToasterService,
        public dialogRef: MatDialogRef<AddNewServerDialogComponent>,
        private serverService: ServerService) {
        this.servers = StorageService.getServers();
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

    serverIdControl = new FormControl('',
        [
            Validators.required,
            Validators.pattern(/^[0-9]+$/), // Проверка, что значение состоит только из цифр
            Validators.min(1) // Проверка, что значение больше нуля
        ]
    );

    publicKeyControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^\S+$/)
        ]
    );

    secretKeyControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^\S+$/)
        ]
    );

    addNewServer() {
        if (this.isFormValid()) {
            const serverName = this.serverNameControl.value;
            const lastServer = this.servers.find(server => server.serverName === serverName) ?? null;
            if (lastServer) {
                this.openSnackBar("Сервер с таким именем уже существует, смените имя сервера")
            } else {
                const newServer: ServerDto = {
                    serverName: this.serverNameControl.value!,
                    serverUrl: this.serverUrlControl.value!,
                    serverUserName: this.serverUserNameControl.value!,
                    serverPassword: this.serverPasswordControl.value!,
                    serverId: parseInt(this.serverIdControl.value!),
                    publicKey: this.publicKeyControl.value!,
                    secretKey: this.secretKeyControl.value!
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
    }

    private getServerList(): void {
        this.serverService.getAll().subscribe({
            next: (data) => {
                    StorageService.addServers(JSON.stringify(data.content));
            },
            error: (e) => console.error(e),
        });
    }


    isFormValid() {
        return this.serverNameControl.valid
            && this.serverUrlControl.valid
            && this.serverUserNameControl.valid
            && this.serverPasswordControl.valid
            && this.serverIdControl.valid
            && this.publicKeyControl.valid
            && this.secretKeyControl.valid;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}

export interface DialogData {
    serverName: string;
    serverUrl: string;
    serverUserName: string;
    serverPassword: string;
    serverId: number;
    publicKey: string;
    secretKey: string;
}
