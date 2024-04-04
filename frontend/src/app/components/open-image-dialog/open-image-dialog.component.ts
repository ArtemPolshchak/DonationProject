import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TransactionService} from "../../services/transaction.service";
import {ToasterService} from "../../services/toaster.service";

@Component({
    selector: 'app-open-image-dialog',
    standalone: true,
    imports: [
        MatDialogClose,
        MatButton,
        MatIconButton,
        MatIcon,
        MatDialogContent,
    ],
    templateUrl: './open-image-dialog.component.html',
    styleUrl: './open-image-dialog.component.scss'
})
export class OpenImageDialogComponent implements OnInit{
    transactionId: number;
    image?: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private transactionService: TransactionService,
                private toasterService: ToasterService) {
        this.transactionId = data;
    }

    ngOnInit(): void {
        this.transactionService.getImage(this.transactionId).subscribe({
            next: (response) => this.image = response.data,
            error: (err) => this.toasterService.openSnackBar(`Can't get image! ${err}`)
        })
    }
}
