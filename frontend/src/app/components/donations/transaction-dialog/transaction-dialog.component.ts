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
import {StorageService} from "../../../services/storage.service";
import {LAST_SERVER_KEY} from "../../../enums/app-constans";
import {ImageProcessorService} from "../../../services/image-processor.service";
import {NgxColorsModule} from "ngx-colors";
import {ToasterService} from "../../../services/toaster.service";

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
        NgxColorsModule,
    ],
    templateUrl: './transaction-dialog.component.html',
    styleUrl: './transaction-dialog.component.scss'
})
export class TransactionDialog implements OnInit {
    tempImg?: string | null;
    @Output() transactionResponse = new EventEmitter();
    maxImgSideSize = 800;
    servers: Server[];
    paymentMethods: string[] = ["PAYPAL", "CARD_RU", "CARD_UA", "USDT", "ETC"];
    payment: string = "PAYPAL";
    transaction: Transaction;
    paymentControl = new FormControl("", Validators.required);
    serverControl = new FormControl<Server | null>(null, Validators.required);
    contributionControl = new FormControl('',
        [Validators.required, Validators.pattern(/^\d+$/)]
    )
    emailControl = new FormControl('',
        [Validators.required,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]
    )
    imageForm = this.fb.group({
        photo: [],
    });
    color!: string;
    hideColorPicker: boolean = true;
    hideTextInput: boolean = true;
    colors: Array<any> = [
        "#D3D3D3",
        "#fd8888",
        "#9dfc9e",
        "#84d4ff",
        "#ffeb8a",
    ];

    constructor(private fb: UntypedFormBuilder,
                private toasterService: ToasterService,
                private dialogRef: MatDialogRef<TransactionDialog>,
                private transactionService: TransactionService,
                private imageProcessor: ImageProcessorService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.servers = this.data.servers;
        this.transaction = this.data.transaction ? this.data.transaction : new Transaction();
    }

    ngOnInit(): void {
        let tempServer = StorageService.getItem(LAST_SERVER_KEY);
        this.paymentControl.setValue(this.payment)
        if (tempServer) {
            const serverId = +(JSON.parse(tempServer))
            const lastServer = this.servers.find(server => server.id === serverId) ?? null;
            this.serverControl.setValue(lastServer);
        }

        if (this.data.transaction) {
            this.serverControl.setValue(this.findServerByName(this.data.transaction.serverName));
            this.contributionControl.setValue(this.data.transaction.contributionAmount);
            this.emailControl.setValue(this.data.transaction.donatorEmail);
            this.paymentControl.setValue(this.data.transaction.paymentMethod);
            this.transactionService.getImage(this.transaction.id).subscribe( {
                next: (res) => {
                    if(res?.data) {
                        this.transaction.image = res.data;
                        this.imageForm.get('photo')?.setValue(this.data.transaction.image);
                    }
                }
            })
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
            this.transaction.imagePreview = this.tempImg;
        }
        this.dialogRef.close();
    }

    proceedTransaction() {
        this.transaction.serverId = this.serverControl.value!.id
        this.transaction.contributionAmount = Number(this.contributionControl.value!);
        this.transaction.paymentMethod = this.paymentControl.value!;
        this.transaction.donatorEmail = this.emailControl.value!;
        this.transaction.id ?
            this.updateTransaction(this.transaction) :
            this.createTransaction(this.transaction);
        this.dialogRef.close();
    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }

    private createTransaction(transaction: Transaction) {
        if(this.color) {
            transaction.color = this.color;
        }

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
        if(this.color) {
            transaction.color = this.color;
        }

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
