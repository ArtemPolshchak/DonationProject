import {Component, EventEmitter, HostListener, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Transaction} from "../../../common/transaction";
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
import {TransactionService} from "../../../services/transaction.service";
import {Server} from "../../../common/server";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../../services/storage.service";
import {LAST_SERVER_KEY} from "../../../enums/app-constans";
import {ImageProcessorService} from "../../../services/image-processor.service";

@Component({
    selector: 'app-transaction-dialog',
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
    templateUrl: './transaction-dialog.component.html',
    styleUrl: './transaction-dialog.component.scss'
})
export class TransactionDialog implements OnInit {
    tempImg?: string | null;
    @Output() transactionResponse = new EventEmitter();
    maxImgSideSize = 800;
    durationInSeconds: number = 5;
    servers: Server[];
    transaction: Transaction;
    serverControl = new FormControl<Server | null>(null, Validators.required);
    contributionControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/\d/)]
    )
    emailControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    )
    imageForm = this.fb.group({
        photo: [],
    });

    constructor(private fb: UntypedFormBuilder,
                private dialogRef: MatDialogRef<TransactionDialog>,
                private transactionService: TransactionService,
                private imageProcessor: ImageProcessorService,
                private _snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.servers = this.data.servers;
        this.transaction = this.data.transaction ? this.data.transaction : new Transaction();
    }

    ngOnInit(): void {
        let tempServer = StorageService.getItem(LAST_SERVER_KEY);
        if (tempServer) {
            const serverId = +(JSON.parse(tempServer))
            const lastServer = this.servers.find(server => server.id === serverId) ?? null;
            this.serverControl.setValue(lastServer);
        }
        if (this.data.transaction) {
            this.serverControl.setValue(this.findServerByName(this.data.transaction.serverName));
            this.contributionControl.setValue(this.data.transaction.contributionAmount);
            this.emailControl.setValue(this.data.transaction.donatorEmail);
            this.imageForm.get('photo')?.setValue(this.data.transaction.image);
        }
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
        this.imageProcessor.compress(file).then(result => {
            this.transaction.image = result;
            this.imageForm.get('photo')?.setValue(this.transaction.image);
        })
    }

    removeImage() {
        this.imageForm.get('photo')?.setValue(null);
        this.tempImg = this.transaction.image;
        this.transaction.image = null;
    }

    onCancel(){
        if(this.tempImg) {
            this.transaction.image = this.tempImg;
        }
        this.dialogRef.close();
    }

    proceedTransaction() {
        this.transaction.serverId = this.serverControl.value!.id
        this.transaction.contributionAmount = Number(this.contributionControl.value!);
        this.transaction.donatorEmail = this.emailControl.value!;
        this.transaction.id ?
            this.updateTransaction(this.transaction) :
            this.createTransaction(this.transaction);
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Закрыть', {
            duration: this.durationInSeconds * 1000,
        });
    }

    private createTransaction(transaction: Transaction) {
        this.transactionService.create(transaction).subscribe({
                next: (result) => {
                    this.transactionResponse.emit(result)
                    StorageService.addItem(LAST_SERVER_KEY, JSON.stringify(this.serverControl.value?.id));
                    this.openSnackBar("Транзакция успешно создана")
                },
                error: (err) => {
                    this.openSnackBar("Ошибка при создании транзакции: " + err.message)
                },
            },
        );
    }

    private updateTransaction(transaction: Transaction) {
        this.transactionService.update(transaction).subscribe({
                next: (result) => {
                    this.transactionResponse.emit(result)
                    this.openSnackBar("Транзакция успешно изменена")
                },
                error: (err) => {
                    this.openSnackBar("Ошибка при обновлении транзакции: " + err.message)
                },
            },
        );
    }

    private findServerByName(serverName: string): Server {
        return this.servers.find(s => s.serverName === serverName)!;
    }
}
