import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  LoginForm!: FormGroup;
  saving = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.LoginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  submitLogin() {
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      return;
    }

    this.error = null;
    this.saving = true;

    setTimeout(() => {
      this.saving = false;
      this.router.navigateByUrl('/menu/home');
    }, 600);
  }
}