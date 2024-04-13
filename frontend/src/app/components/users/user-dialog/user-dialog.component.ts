import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from '@angular/material/dialog';
import {Role} from '../../../enums/role';
import {User} from '../../../common/user';
import {UserService} from '../../../services/user.service';
import {ToasterService} from '../../../services/toaster.service';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control?.value.password;
    const repeatedPassword = control?.value.repeatedPassword;
    if (password !== repeatedPassword) {
        control.get('repeatedPassword')?.setErrors({passwordMatch: true})
        return {passwordMatch: true};
    }
    control.get('repeatedPassword')?.setErrors(null);
    return null;
};

@Component({
    selector: 'app-user-dialog',
    standalone: true,
    imports: [
        MatDialogContent,
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatIconButton,
        MatSuffix,
        MatSelect,
        MatOption,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatInput,
        MatIconButton,
        MatError,
        NgForOf,
        NgIf,
        MatIcon
    ],
    templateUrl: './user-dialog.component.html',
    styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit {
    @Output() dialogResponse = new EventEmitter();
    user: User = new User();
    passwordFieldHide = true;
    form: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<UserDialogComponent>,
                private userService: UserService,
                private toasterService: ToasterService,
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            role: [Role.GUEST, [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            repeatedPassword: ['']
        }, {validators: passwordMatchValidator})
    };


    ngOnInit(): void {
        if (this.data) {
            this.user.id = this.data.id;
            this.user.role = this.data.role;
            this.user.username = this.data.username;
            this.user.email = this.data.email;
            this.form.get('password')?.setValidators([Validators.minLength(5), Validators.maxLength(50)])
            this.form.patchValue({
                email: this.user.email,
                role: this.user.role,
                username: this.user.username,
            });
        }
    }

    proceedUser() {
        const formValue = this.form.value;
        this.user.email = formValue.email;
        this.user.username = formValue.username;
        this.user.role = formValue.role;
        if (formValue.password) {
            this.user.password = formValue.password;
            this.user.repeatedPassword = formValue.repeatedPassword;
        }
        this.user.id ? this.updateUser(this.user) : this.createUser(this.user);
        this.dialogRef.close();
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

    protected readonly Role = Role;
    protected readonly Object = Object;

    isFormValid() {
        if (this.user.id && this.form.get('password')?.value!.length === 0) {
            this.form.get('password')?.setErrors(null);
            this.form.get('repeatedPassword')?.setErrors(null);
            this.form.updateValueAndValidity();
        }
        return this.form.valid;
    }
}
