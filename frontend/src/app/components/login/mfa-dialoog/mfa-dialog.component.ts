import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from "@angular/material/dialog";
import {StorageService} from "../../../services/storage.service";
import {ServerService} from "../../../services/server.service";
import {ToasterService} from "../../../services/toaster.service";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
    selector: 'app-mfa',
    standalone: true,
    templateUrl: './mfa-dialog.component.html',
    imports: [
        ReactiveFormsModule,
        NgIf,
        MatButton,
        MatCard,
        MatDialogContent,
        MatDialogActions,
        MatCardContent,
        MatDialogClose
    ],
    styleUrls: ['./mfa-dialog.component.scss']
})
export class MfaDialogComponent implements OnInit {
    totpForm!: FormGroup
    errorMessage?: string;
    validators = [Validators.required,
        Validators.maxLength(1),
        Validators.pattern("^[0-9]{1}$")];


    constructor(private authService: AuthService,
                private serverService: ServerService,
                private toasterService: ToasterService,
                private router: Router,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<MfaDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit(): void {
        this.totpForm = this.fb.group({
            totp_digit1: [''], totp_digit2: [''], totp_digit3: [''],
            totp_digit4: [''], totp_digit5: [''], totp_digit6: [''],
        });
        Object.keys(this.totpForm.controls)
            .forEach(k => this.totpForm.get(k)?.setValidators(this.validators))
    }

    numberOnly(event: any, formName: string){
        if(isNaN(event.key) && event.key !== 'Backspace') {
            event.preventDefault();
        } else if (this.totpForm.get(formName)?.value) {
            this.totpForm.get(formName)?.setValue(event.key)
        }
    }

    moveToNextElement(formName: string, nextFromId: string) {
        if (this.totpForm.get(formName)?.valid) {
            document.getElementById(nextFromId)?.focus();
        }
    }

    clearOnBackspace(formName: string, previousFormId?: string) {
        this.totpForm.get(formName)?.setValue('');
        if (previousFormId) {
            document.getElementById(previousFormId)?.focus();
        }
        this.errorMessage ? this.errorMessage = '' : {};
    }

    verifyTotp() {
        if (!this.totpForm.valid){
            this.errorMessage = 'Invalid Form!'
            return;
        }
        this.errorMessage = '';
        this.authService.verifyTotp({username: this.data, code: this.getTotpCode()}).subscribe({
            next: (response) => {
                StorageService.addToken(response.token);
                this.setServersToStorage();
            },
            error: (err) => {
                this.errorMessage = err.error.status === 403 ? "TOTP validation failed!" : err.message
                this.toasterService.openSnackBar("Something went wrong :(");
            },
        })

    }

    private setServersToStorage() {
        return this.serverService.getAll().subscribe({
            next: (data) => {
                StorageService.addServers(JSON.stringify(data.content));
                this.authService.redirectBasedOnRole()
            },
            error: (err) => {
                this.toasterService.openSnackBar("Can't retrieve servers! " + err);
            },
            complete: () => this.dialogRef.close()
        });
    }

    private getTotpCode(): string {
        let code: string = '';
        Object.keys(this.totpForm.controls)
            .forEach(k => {
                code += this.totpForm.get(k)?.value;
            })
        return code;
    }
}
