import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
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
import { MessageModule } from 'primeng/message';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HomeService } from 'src/app/pages/customers/customers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  RegistrationForm!: FormGroup;
  saving = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private homeService: HomeService, private router: Router) {
    this.RegistrationForm = this.fb.group({
      nome: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, this.cpfValidator()]),
      telefone: new FormControl('', [Validators.required, this.phoneValidator()]),
    });
  }

  private onlyDigits(value: any): string {
    return String(value ?? '').replace(/\D/g, '');
  }

  private cpfValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const digits = this.onlyDigits(control.value);
      if (digits.length !== 11) return { cpfInvalid: true };
      if (/^(\d)\1{10}$/.test(digits)) return { cpfInvalid: true };
      return null;
    };
  }

  private phoneValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const digits = this.onlyDigits(control.value);
      if (digits.length !== 10 && digits.length !== 11) return { phoneInvalid: true };
      return null;
    };
  }

  onSave() {
    if (this.RegistrationForm.invalid || this.saving) return;
    this.saving = true;
    this.error = null;
    const payload = {
      cpf: this.onlyDigits(this.RegistrationForm.get('cpf')?.value),
      nome: String(this.RegistrationForm.get('nome')?.value || '').trim(),
      telefone: this.onlyDigits(this.RegistrationForm.get('telefone')?.value),
    };

    this.homeService.createItem(payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/menu/clientes']);
      },
      error: (error) => {
        const msg = error?.error?.message || 'Cpf ja cadastrado.';
        this.error = typeof msg === 'string' ? msg : 'Erro ao salvar dados. Tente novamente.';
        this.saving = false;
      },
    });
  }
}
