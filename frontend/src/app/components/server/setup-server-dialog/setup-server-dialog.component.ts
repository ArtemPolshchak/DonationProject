import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
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
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Server} from "../../../common/server";
import {ServerDto, ServerService} from "../../../services/server.service";
import {StorageService} from "../../../services/storage.service";
import {ToasterService} from "../../../services/toaster.service";

@Component({
    selector: 'app-setup-server-dialog',
    standalone: true,
    imports: [
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
    templateUrl: './setup-server-dialog.component.html',
    styleUrl: './setup-server-dialog.component.scss'
})
export class SetupServerDialogComponent implements OnInit {
    servers?: Server[];
    serverId: number;
    lastServerName!: string;
    @Output() componentResponse = new EventEmitter();
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

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toasterService: ToasterService,
        public dialogRef: MatDialogRef<SetupServerDialogComponent>,
        private serverService: ServerService) {
        this.servers = StorageService.getServers();
        this.serverId = data.serverId;

    }

    ngOnInit(): void {
        this.setServerFields();
    }

    findServerByName(serverName: string) {
        return this.servers!.find(server => server.serverName === serverName) ?? null;
    }

    updateServer() {
        if (this.isFormValid()) {
            const serverName = this.serverNameControl.value;
            const lastServer = this.findServerByName(serverName!);
            if (lastServer && lastServer.serverName != this.lastServerName) {
                this.openSnackBar("Сервер с таким именем уже существует, смените имя сервера")
            } else {
                const newServer: ServerDto = {
                    serverName: this.serverNameControl.value!,
                    serverUrl: this.serverUrlControl.value!,
                    serverUserName: this.serverUserNameControl.value!,
                    serverPassword: this.serverPasswordControl.value!,
                    publicKey: this.publicKeyControl.value!,
                    secretKey: this.secretKeyControl.value!
                };

                this.serverService.updateServerById(this.serverId, newServer).subscribe({
                        next: (result) => {
                            this.componentResponse.emit(result)
                            this.getServerList();
                            this.openSnackBar("Сервер успешно обновлен")
                        },
                        error: (err) => this.openSnackBar("Ошибка при обновлении сервера: " + err.message),
                        complete: () => this.dialogRef.close()
                    },
                );
            }

        }
    }

    public setServerFields(): void {
        this.serverService.getServerById(this.serverId).subscribe({
            next: (data) => {
                this.lastServerName = data.serverName;
                this.serverNameControl.setValue(data.serverName);
                this.serverUrlControl.setValue(data.serverUrl);
                this.serverUserNameControl.setValue(data.serverUserName);
                this.serverPasswordControl.setValue(data.serverPassword);
                this.publicKeyControl.setValue(data.publicKey);
                this.secretKeyControl.setValue(data.secretKey);
            }
        });
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
            && this.publicKeyControl.valid
            && this.secretKeyControl.valid;
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}
