import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

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
export class OpenImageDialogComponent{
    image: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.image = data;
    }

    protected readonly close = close;
}
