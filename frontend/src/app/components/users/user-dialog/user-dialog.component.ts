import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {NgxColorsModule} from "ngx-colors";
import {AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators} from "@angular/forms";
import {Role} from "../../../enums/role";
import {User} from "../../../common/user";
import {UserService} from "../../../services/user.service";
import {ToasterService} from "../../../services/toaster.service";

@Component({
    selector: 'app-user-dialog',
    standalone: true,
    imports: [
        MatButton,
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
        MatDialogClose,
        MatIconButton,
        MatSuffix
    ],
    templateUrl: './user-dialog.component.html',
    styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit {
    @Output() dialogResponse = new EventEmitter();
    user: User = new User();
    passwordFieldHide = true;

    emailControl = new FormControl('',
        [Validators.required,
            Validators.email]
    );

    usernameControl = new FormControl('',
        [Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50)]
    );

    passwordControl = new FormControl('',
        [Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50)]
    );

    repeatedPasswordControl = new FormControl('',
        [
            (control: AbstractControl): ValidationErrors | null => {
                const password = this.passwordControl.value as string;
                const passwordConfirm = control.value as string;
                if (password !== passwordConfirm) {
                    return {passwordMatch: true};
                }
                return null;
            }
        ]
    );

    roleControl = new FormControl<Role | null>(Role.GUEST,
        [Validators.required]);

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<UserDialogComponent>,
                private userService: UserService,
                private toasterService: ToasterService,
    ) {
        if (data) {
            this.user.id = data.id;
            this.user.role = data.role;
            this.user.username = data.username;
            this.user.email = data.email;
        }
    }

    ngOnInit(): void {
        if (this.user) {
            this.emailControl.setValue(this.user.email)
            this.roleControl.setValue(this.user.role)
            this.usernameControl.setValue(this.user.username)
        }
    }

    proceedUser() {
        this.user.email = this.emailControl.value!;
        this.user.username = this.usernameControl.value!;
        this.user.role = this.roleControl.value!
        if (this.passwordControl.value) {
            this.user.password = this.passwordControl.value!
            this.user.repeatedPassword = this.repeatedPasswordControl.value!
        }
        this.user.id ? this.updateUser(this.user) : this.createUser(this.user);
        this.dialogRef.close();
    }

    public isFormsValid() {
        return this.emailControl.valid && this.usernameControl.valid
            && (this.passwordControl.valid && this.repeatedPasswordControl.valid
                || this.user.id && !this.passwordControl.value && !this.repeatedPasswordControl.value);
    }

    private createUser(user: User) {
        this.userService.create(user).subscribe({
            next: (user) => {
                this.dialogResponse.emit(user);
                this.toasterService.openSnackBar("User was created!")
            },
            error: (err) => {
                this.toasterService.openSnackBar(err.message)
            }
        });
    }

    private updateUser(user: User) {
        this.userService.update(user).subscribe({
            next: (user) => {
                this.dialogResponse.emit(user);
                this.toasterService.openSnackBar("User was updated!")
            },
            error: (err) => {
                this.toasterService.openSnackBar(err.message)
            }
        });
    }

    protected readonly Object = Object;
    protected readonly Role = Role;
}
