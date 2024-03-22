import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {LoginService} from "../../services/login.service";
import {ServerService} from "../../services/server.service";


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

  constructor(private fb: FormBuilder, private loginService: LoginService, private serverService: ServerService) {

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loginService.login(this.form.value).subscribe(
          () => {
            this.error = null;
            this.loginSuccess.emit();
            this.getServerList();
          },
          error => {
            this.error = error.message;
          }
      );
    }
  }

  private getServerList(): void {
    sessionStorage.removeItem('servers');
    this.serverService.getAll().subscribe({
      next: (v) =>
          sessionStorage.setItem('servers', JSON.stringify(v.content)),
      error: (e) => console.error(e),
    });
  }
}

