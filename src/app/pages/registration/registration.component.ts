import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ReactiveFormsModule, InputTextModule, MessageModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  RegistrationForm!: FormGroup;

  constructor(private fb: FormBuilder) {
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
}
