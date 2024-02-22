import {Component, Inject} from '@angular/core';
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

      // Проходимося по всіх наступних бонусах
      for (let j = i + 1; j < bonusesCount; j++) {
        const nextBonus = bonusesArray.at(j) as FormGroup;

        if (!nextBonus) continue; // Перевіряємо на нульовий об'єкт

        const nextFromValue = nextBonus.get('from')?.value; // Додано перевірку на нульовий об'єкт
        const nextToValue = nextBonus.get('to')?.value; // Додано перевірку на нульовий об'єкт

        // Перевіряємо на наявність накладення
        if ((fromValue && nextFromValue && fromValue >= nextFromValue && fromValue <= nextToValue) ||
            (toValue && nextFromValue && toValue >= nextFromValue && toValue <= nextToValue)) {
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

      const nextBonus = bonusesArray.at(i + 1) as FormGroup;
      const nextToValue = nextBonus.get('to')?.value; // Додано перевірку на нульовий об'єкт

      // Перевіряємо на виконання умови
      if (fromValue && nextToValue && fromValue >= nextToValue) {
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
export class ServerBonusComponent {
  bonusesForm: FormGroup;


  constructor(
      public dialogRef: MatDialogRef<ServerBonusComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private serverBonusService: ServerBonusService
  ) {
    this.bonusesForm = this.fb.group({
      bonuses: this.fb.array([], Validators.required)
    }, {
      validators: [noOverlapBonusValidator(), validBonusRangeValidator()]
    });

  }

  addBonus(): void {
    this.bonuses.push(
        this.fb.group({
          enable: [false, Validators.required],
          from: [0, [Validators.required, Validators.pattern(/\d/)]],
          to: [0, [Validators.required, Validators.pattern(/\d/)]],
          percentage: [0, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1), Validators.max(100)]]
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
      const serverId = this.data.serverId; // Отримати ідентифікатор сервера з вхідних даних
      const serverBonuses = this.bonusesForm.value.bonuses; // Отримати список бонусів для відправки на бекенд

      // Перетворення форми в відповідний формат для відправки на бекенд
      const createServerBonusesDtoArray = serverBonuses.map((bonus: any) => ({
        fromAmount: bonus.from,
        toAmount: bonus.to,
        bonusPercentage: bonus.percentage
      }));


      this.serverBonusService.createOrRecreateBonuses(createServerBonusesDtoArray, serverId).subscribe({
        next: (response) => {
          // Обробити успішну відповідь від бекенда
          console.log('Server bonuses created or recreated successfully:', response);
          this.dialogRef.close(response); // Закрити діалогове вікно після успішного створення або перестворення бонусів
        },
        error: (error) => {
          // Обробити помилку від бекенда
          console.error('Error creating or recreating server bonuses:', error);
          // Додати обробку помилки або повідомлення користувачу
        }
      });
    } else {
      // Handle form validation errors
    }
  }

}