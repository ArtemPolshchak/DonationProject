import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {Transaction} from "../../../../common/transaction";
import {FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatOption, MatSelect} from "@angular/material/select";
import {TransactionService} from "../../../../services/transaction.service";
import {Server} from "../../../../common/server";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-create-transaction-dialog',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatButtonToggleModule,
        MatCardModule,
        MatTableModule,
        MatGridListModule,
        MatSelect,
        MatOption,
        MatIcon,
    ],
    templateUrl: './create-transaction-dialog.component.html',
    styleUrl: './create-transaction-dialog.component.scss'
})
export class CreateTransactionDialog {
    maxImgSideSize = 800;
    durationInSeconds: number = 5;
    servers: Server[];
    transaction: Transaction = new Transaction();
    serverControl = new FormControl<Server | null>(null, Validators.required);
    contributionControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/\d/)]
    )
    emailControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    )
    editForm = this.fb.group({
        photo: [],
    });


    constructor(private fb: UntypedFormBuilder,
                private transactionService: TransactionService,
                private _snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.servers = data;
    }

    isFormValid() {
        return this.serverControl.valid && this.contributionControl.valid && this.emailControl.valid;
    }

    emitFiles(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target?.files) {
            const file: File = target.files?.[0];
            this.saveImage(file);
        }
    }

    @HostListener('window:paste', ['$event']) onPaste(event: ClipboardEvent) {
        if (event?.clipboardData?.files) {
            const file = event.clipboardData.files?.[0];
            this.saveImage(file);
        }
    }

    saveImage(file: File) {
        const reader = new FileReader();
        const img = new Image()
        reader.addEventListener('load', () => {
            this.editForm.get('photo')?.setValue(reader.result as string);
            this.compressImage(reader.result as string).then(result => {
                    this.transaction.image = result as string;
                }
            );
        });
        reader.readAsDataURL(file);
    }

    compressImage(src: string) {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = src;
            console.log(src)
            img.onload = () => {
                const elem = document.createElement('canvas');
                if (img.height > img.width) {
                    elem.height = this.maxImgSideSize
                    elem.width = img.width * (this.maxImgSideSize / img.height)
                } else {
                    elem.width = this.maxImgSideSize
                    elem.height = img.height * (this.maxImgSideSize / img.width)
                }
                const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
                console.log(img.width + " " + img.height);
                console.log((this.maxImgSideSize / img.height));
                console.log(elem.width + " " + elem.height);
                ctx.drawImage(img, 0, 0, elem.width, elem.height);
                const data = ctx.canvas.toDataURL();
                res(data);
            }
            img.onerror = error => rej(error);
        })
    }

    removeImage() {
        this.editForm.get('photo')?.setValue(null);
        this.transaction.image = "";
    }

    createTransaction() {
        this.transaction.serverId = this.serverControl.value!.id
        this.transaction.contributionAmount = Number(this.contributionControl.value!);
        this.transaction.donatorEmail = this.emailControl.value!;
        console.log(this.transaction.image)
        this.transactionService.create(this.transaction).subscribe(
            () => {
                this.openSnackBar("Транзакция успешно создана")
            },
            err => {
                this.openSnackBar("Ошибка при создании транзакции: " + err.message)
            }
        );
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Закрыть', {
            duration: this.durationInSeconds * 1000,
        });
    }

    protected readonly HTMLInputElement = HTMLInputElement;
}
