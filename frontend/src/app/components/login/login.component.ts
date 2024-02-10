import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {LoginService} from "../../services/login.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    NgIf,
    MatInput,
    MatButton,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
      FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;

  @Output() loginSuccess = new EventEmitter();

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loginService.login(this.form.value).subscribe(
          () => {
            // Видалити повідомлення про помилку
            this.error = null;
            // Оповістити батьківський компонент про успішний вхід
            this.loginSuccess.emit();
          },
          error => {
            // Обробити помилку входу
            this.error = error.message;
          }
      );
    }
  }
}

