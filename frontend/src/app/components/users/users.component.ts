import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {User} from "../../common/user";
import {UserService} from "../../services/user.service";
import {ToasterService} from "../../services/toaster.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDialogComponent} from "./user-dialog/user-dialog.component";

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        NgForOf,
        MatFormField,
        MatInput,
        MatIcon,
        MatButton,
        FormsModule,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatLabel,
        NgIf,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    pageNumber: number = 0;
    pageSize: number = 10;
    selectedItem: any;

    constructor(private userService: UserService,
                private toasterService: ToasterService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getAllUsers();
    }

    openCreateUserDialog() {
        let matDialogRef = this.dialog.open(UserDialogComponent, {
            width: '50%',
        });
        matDialogRef.componentInstance.dialogResponse.subscribe(() => {
            this.getAllUsers();
        })
    }

    openUpdateUserDialog(user: User) {
        let matDialogRef = this.dialog.open(UserDialogComponent, {
            width: '50%',
            data: user
        });
        matDialogRef.componentInstance.dialogResponse.subscribe(() => {
            this.getAllUsers();
        })
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }

    private getAllUsers() {
        this.userService.getAll(this.pageNumber, this.pageSize)
            .subscribe(data => {
                this.users = data.content
            })
    }
}
