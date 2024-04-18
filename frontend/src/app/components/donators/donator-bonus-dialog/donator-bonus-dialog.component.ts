import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent, MatDialogRef,
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {ServerService} from "../../../services/server.service";
import {ToasterService} from "../../../services/toaster.service";
import {DonatorsBonusesFromAllServers} from "../../../common/donators-bonuses-from-all-servers";
import {MatIcon} from "@angular/material/icon";


@Component({
    selector: 'app-donator-bonus-dialog',
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatCard,
        MatCardContent,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        MatIcon,
        MatIconButton
    ],

    templateUrl: './donator-bonus-dialog.component.html',
    styleUrl: './donator-bonus-dialog.component.scss'
})
export class DonatorBonusDialogComponent implements OnInit {
    donatorsBonuses: DonatorsBonusesFromAllServers[] = [];
    donatorId: number;
    donatorEmail: string;
    response = new EventEmitter()
    bonusesGroup: FormGroup = this.fb.group({
        bonuses: this.fb.array(this.donatorsBonuses, Validators.required)

    });

    constructor(
        private fb: FormBuilder,
        private serverService: ServerService,
        private toasterService: ToasterService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DonatorBonusDialogComponent>
    ) {
        this.donatorId = data.donatorId;
        this.donatorEmail = data.donatorEmail;
    }

    ngOnInit(): void {
        this.getAllBonusesForDonatorFromAllServers(this.donatorId);
    }

    get bonuses(): FormArray {
        return this.bonusesGroup.get('bonuses') as FormArray;
    }

    addBonus(bonuses?: DonatorsBonusesFromAllServers): void {
        this.bonuses.push(
            this.fb.group({
                enable: [false, Validators.required],
                serverId: [bonuses!.serverId ?? ""],
                serverName: [bonuses!.serverName ?? "", [Validators.required]],
                personalBonus: [bonuses!.personalBonus ?? "", [Validators.required, Validators.min(0), Validators.max(100)]]
            })
        );
    }

    getAllBonusesForDonatorFromAllServers(donatorId: number) {
        this.serverService.getAllDonatorsBonusesFromAllServers(donatorId)
            .subscribe((data) => {
                this.donatorsBonuses = data;
                data.forEach(bonuses => this.addBonus(bonuses));
            });
    }

    save() {
        if (this.bonusesGroup.valid) {
            const donatorsBonusesFromAllServers = this.bonusesGroup.value.bonuses;
            const createDonatorBonusDtoArray = donatorsBonusesFromAllServers.map((bonus: any) => ({
                serverId: bonus.serverId,
                personalBonus: bonus.personalBonus
            }));

            this.dialogRef.close();

            this.serverService.updateAllDonatorsBonusesFromAllServers(createDonatorBonusDtoArray, this.donatorId).subscribe({
                next: (response) => {
                    this.dialogRef.close(response);
                    this.openSnackBar("Бонусы сервера успешно доданы")
                },
                error: (error) => {
                    this.openSnackBar("Произошла ошибка: " + error.message)
                }
            });
        }

    }

    openSnackBar(message: string) {
        this.toasterService.openSnackBar(message);
    }
}
