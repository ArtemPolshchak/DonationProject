import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {ServerService} from "../../services/server.service";
import {take} from "rxjs";
import {MatDialogContent} from "@angular/material/dialog";
import {ToasterService} from "../../services/toaster.service";


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
export class LoginComponent {
    form: FormGroup;
    error: string | null = null;

    constructor(private fb: FormBuilder,
                private loginService: LoginService,
                private serverService: ServerService,
                private router: Router,
                private toasterService: ToasterService
    ) {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit() {
        if (this.form.valid) {
            this.loginService.login(this.form.value).subscribe({
                next: (response) => {
                    StorageService.watchToken().subscribe({
                        next: () => this.getServerList()
                    })
                    StorageService.addToken(response.token);
                },
                error: (err) => {
                    this.error = err.message;
                }
            })
        }
    }

    private getServerList(): void {
        this.serverService.getAllServerNames().subscribe({
            next: (data) => {
                StorageService.addServers(JSON.stringify(data.content));
                this.redirectBasedOnRole(StorageService.getUser()?.role)
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    private redirectBasedOnRole(role: string | undefined): void {
        switch (role) {
            case 'ADMIN':
                this.router.navigateByUrl('/dashboard');
                break;
            case 'MODERATOR':
                this.router.navigateByUrl('/donations');
                break;
            default:
                this.router.navigateByUrl('/app-guest-page');
        }
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}

