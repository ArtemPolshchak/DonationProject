import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {ServerService} from "../../services/server.service";
import {MatDialogContent} from "@angular/material/dialog";
import {ToasterService} from "../../services/toaster.service";
import {AuthService} from "../../services/auth.service";


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
    error: string | null = null;
    form: FormGroup = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });

    constructor(private fb: FormBuilder,
                private loginService: LoginService,
                private serverService: ServerService,
                private router: Router,
                private toasterService: ToasterService,
                private authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.authService.isLoggedIn() ? this.redirectBasedOnRole() : {};
    }

    submit() {
        if (this.form.valid) {
            this.loginService.login(this.form.value).subscribe({
                next: (response) => {
                    StorageService.addToken(response.token);
                    this.setServersToStorage();
                },
                error: (err) => {
                    this.toasterService.openSnackBar(err);
                }
            })
        }
    }

    private setServersToStorage() {
        return this.serverService.getAll().subscribe({
            next: (data) => {
                StorageService.addServers(JSON.stringify(data.content));
                this.redirectBasedOnRole()
            },
            error: (err) => {
                this.toasterService.openSnackBar(err);
            },
        });
    }

    private redirectBasedOnRole(): void {
        switch (StorageService.getUser()?.role) {
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
}

