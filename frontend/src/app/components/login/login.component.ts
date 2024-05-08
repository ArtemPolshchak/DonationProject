import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatDialog, MatDialogContent} from "@angular/material/dialog";
import {ToasterService} from "../../services/toaster.service";
import {AuthService} from "../../services/auth.service";
import {MfaDialogComponent} from "./mfa-dialoog/mfa-dialog.component";
import {QrCodeDialogComponent} from "./qr-code-dialog/qr-code-dialog.component";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        MatCardTitle,
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        NgIf,
        MatInput,
        MatButton,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        MatDialogContent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    error?: string;
    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    constructor(private fb: FormBuilder,
                private toasterService: ToasterService,
                private authService: AuthService,
                private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.authService.isLoggedIn() ? this.authService.redirectBasedOnRole() : {};
    }

    submit() {
        if (this.loginForm.valid) {
            this.error = '';
            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    response ? this.dialog.open(QrCodeDialogComponent, {
                            data: {
                                qrCodeImg: response.qrCode,
                                username: this.loginForm.get('username')?.value,
                            }
                        })
                        : this.dialog.open(MfaDialogComponent, {
                            data: this.loginForm.get('username')?.value
                        })
                },
                error: (err) => {
                    this.error = 'Wrong login or password!'
                    this.toasterService.openSnackBar(err.message);
                }
            })
        }
    }
}
