import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  SignupForm!: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.SignupForm = this.fb.group(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        password_confirmation: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordsMatchValidator() }
    );
  }

  private passwordsMatchValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const passwordConfirmation = group.get('password_confirmation')?.value;
      if (!password || !passwordConfirmation) return null;
      return password === passwordConfirmation ? null : { passwordsMismatch: true };
    };
  }

  onSubmit() {
    if (this.SignupForm.invalid) return;

    const payload = this.SignupForm.value;
    this.auth.getCsrfCookie().subscribe({
      next: () => {
        this.auth.register(payload).subscribe({
          next: () => {
            this.router.navigate(['/']);
            console.log('Registro bem-sucedido!', payload);
          },
          error: (err) => {
            const msg = err?.error?.message || 'Erro ao registrar. Tente novamente.';
            this.error = typeof msg === 'string' ? msg : 'Erro ao registrar. Tente novamente.';
          },
        });
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro de segurança (CSRF). Tente novamente.';
        this.error = typeof msg === 'string' ? msg : 'Erro de segurança (CSRF). Tente novamente.';
      },
    });
  }
}
