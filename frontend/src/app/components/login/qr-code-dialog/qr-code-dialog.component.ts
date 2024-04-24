import {Component, Inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MfaDialogComponent} from "../mfa-dialoog/mfa-dialog.component";
import {MatButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {NgxColorsModule} from "ngx-colors";

@Component({
    selector: 'app-qr-code-dialog',
    standalone: true,
    imports: [
        MatDialogClose,
        FormsModule,
        MatCard,
        MatCardContent,
        MatDialogActions,
        MatDialogContent,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        NgxColorsModule,
        ReactiveFormsModule,
        MatButton
    ],
    templateUrl: './qr-code-dialog.component.html',
    styleUrl: './qr-code-dialog.component.scss'
})
export class QrCodeDialogComponent {
    qrCodeImg: string;
    username: string;

    constructor(private authService: AuthService,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) data: any) {
        this.qrCodeImg = data.qrCodeImg;
        this.username = data.username;
    }

    next() {
        this.dialog.open(MfaDialogComponent, {
            data: this.username
        })
    }
}
