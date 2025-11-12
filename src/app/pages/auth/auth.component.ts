import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

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

  error: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.LoginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  onSubmit() {
    if (this.LoginForm.invalid) return;

    const payload = this.LoginForm.value;
    console.log('Payload:', payload);
    this.auth.login(payload).subscribe({
      next: (res) => {
        const token = res?.token ?? res?.access_token;
        const abilities = res?.abilities ?? [];
        console.log('Login bem-sucedido!', res);
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token:', token);
          localStorage.setItem('abilities', JSON.stringify(abilities));
          console.log(localStorage.getItem('token'));
        } else {
          console.log('Sessão autenticada via cookie (Sanctum).');
        }
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao fazer login. Tente novamente.';
        this.error = msg;
        console.error(msg);
      },
    });
  }
}
