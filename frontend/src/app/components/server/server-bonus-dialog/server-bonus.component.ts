import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {
  AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule,
  ValidatorFn, Validators
} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {ServerBonusService} from "../../../services/server-bonus.service";
import {ServerBonuses} from "../../../common/server-bonuses";
import {ToasterService} from "../../../services/toaster.service";


function noOverlapBonusValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const bonusesArray = control.get('bonuses') as FormArray;
    const bonusesCount = bonusesArray.length;

    // Проходимося по кожному бонусу та перевіряємо, чи є накладення
    for (let i = 0; i < bonusesCount; i++) {
      const currentBonus = bonusesArray.at(i) as FormGroup;

      if (!currentBonus) continue; // Перевіряємо на нульовий об'єкт

      const fromValue = currentBonus.get('from')?.value; // Додано перевірку на нульовий об'єкт
      const toValue = currentBonus.get('to')?.value; // Додано перевірку на нульовий об'єкт

      // Перевіряємо, чи є накладення
      if (fromValue !== null && toValue !== null && fromValue >= toValue) {
        return { 'overlap': true }; // Якщо є накладення, повертаємо помилку
      }

      // Перевіряємо, чи збігаються значення "до" і "от" у сусідніх інтервалах
      if (i < bonusesCount - 1) {
        const nextBonus = bonusesArray.at(i + 1) as FormGroup;
        const nextFromValue = nextBonus.get('from')?.value;

        if (toValue !== null && nextFromValue !== null && toValue >= nextFromValue) {
          return { 'overlap': true }; // Якщо є накладення, повертаємо помилку
        }
      }
    }
    return null; // Якщо накладень не знайдено, повертаємо null
  };
}

// Валідатор для перевірки, щоб кожен "БОНУС ДО" був менше ніж наступний "БОНУС ОТ"
function validBonusRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const bonusesArray = control.get('bonuses') as FormArray;
    const bonusesCount = bonusesArray.length;

    // Проходимося по кожному бонусу та перевіряємо, чи виконується умова
    for (let i = 0; i < bonusesCount - 1; i++) {
      const currentBonus = bonusesArray.at(i) as FormGroup;

      if (!currentBonus) continue; // Перевіряємо на нульовий об'єкт

      const fromValue = currentBonus.get('from')?.value; // Додано перевірку на нульовий об'єкт
      const toValue = currentBonus.get('to')?.value;

      // Перевіряємо, щоб "до" поточного бонусу був менше за "от" наступного бонусу
      const nextBonus = bonusesArray.at(i + 1) as FormGroup;
      const nextToValue = nextBonus.get('to')?.value;

      if (fromValue !== null && nextToValue !== null && fromValue >= nextToValue) {
        return { 'invalidRange': true }; // Якщо умова не виконується, повертаємо помилку
      }
    }
    return null; // Якщо умова виконується для всіх бонусів, повертаємо null
  };
}



@Component({
  selector: 'app-server-bonus',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    ReactiveFormsModule,
    NgForOf,
    MatFormField,
    MatLabel,
    MatInput,
    NgIf,
    MatIconButton,
    MatIcon,
    MatDialogClose,
      MatError
  ],
  templateUrl: './server-bonus.component.html',
  styleUrl: './server-bonus.component.scss'
})
export class ServerBonusComponent implements OnInit {
  serverBonuses: ServerBonuses[] = [];
  serverId!: number;
  bonusesForm: FormGroup = this.fb.group({
    bonuses: this.fb.array(this.serverBonuses, Validators.required)
  }, {
    validators: [noOverlapBonusValidator(), validBonusRangeValidator()]
  });


  constructor(
      public dialogRef: MatDialogRef<ServerBonusComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private serverBonusService: ServerBonusService,
      private toasterService: ToasterService
  ) {
    this.serverId = data.serverId;
  }

  ngOnInit(): void {
    this.getServerBonuses();
  }

  isButtonDisabled(): boolean {
    return this.bonusesForm.invalid;
  }

  addBonus(bonuses?: ServerBonuses): void {
    this.bonuses.push(
        this.fb.group({
          enable: [false, Validators.required],
          from: [bonuses?.fromAmount ?? 0, [Validators.required, Validators.pattern(/\d/)]],
          to: [bonuses?.toAmount ?? 0, [Validators.required, Validators.pattern(/\d/)]],
          percentage: [bonuses?.bonusPercentage ?? 0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(100)]]
        })
    );
  }

  removeBonus(index: number): void {
    this.bonuses.removeAt(index);
  }

  get bonuses(): FormArray {
    return this.bonusesForm.get('bonuses') as FormArray;
  }

  save(): void {
    if (this.bonusesForm.valid) {
      const serverId = this.data.serverId;
      const serverBonuses = this.bonusesForm.value.bonuses;

      const createServerBonusesDtoArray = serverBonuses.map((bonus: any) => ({
        fromAmount: bonus.from,
        toAmount: bonus.to,
        bonusPercentage: bonus.percentage
      }));


      this.serverBonusService.createOrRecreateBonuses(createServerBonusesDtoArray, serverId).subscribe({
        next: (response) => {
          this.dialogRef.close(response); // Закрити діалогове вікно після успішного створення або перестворення бонусів
        },
        error: (error) => {
          // Обробити помилку від бекенда
          // Додати обробку помилки або повідомлення користувачу
          // + toaster
        }
      });
    } else {
      // Handle form validation errors
    }
  }

  getServerBonuses(): void {
    this.serverBonusService.getServerBonusesFromServerById(this.serverId)
        .subscribe((data) => {
          this.serverBonuses = data;
          data.forEach(bonuses => this.addBonus(bonuses));
        });
  }

  openSnackBar(message: string) {
    this.toasterService.openSnackBar(message);
  }
}