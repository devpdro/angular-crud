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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edition',
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
  templateUrl: './edition.component.html',
  styleUrl: './edition.component.scss',
})
export class EditionComponent {
  EditionForm!: FormGroup;
  saving = false;
  error: string | null = null;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.EditionForm = this.fb.group({
      nome: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, this.cpfValidator()]),
      telefone: new FormControl('', [Validators.required, this.phoneValidator()]),
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);
    if (!this.id) return;

    this.homeService.getItem(this.id).subscribe({
      next: (item) => {
        this.EditionForm.patchValue({
          nome: item.nome,
          cpf: item.cpf,
          telefone: item.telefone,
        });
      },
      error: () => {
        this.error = 'Erro ao carregar dados. Tente novamente.';
      },
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
    if (this.EditionForm.invalid || this.saving || !this.id) return;
    this.saving = true;
    this.error = null;
    const payload = {
      cpf: this.onlyDigits(this.EditionForm.get('cpf')?.value),
      nome: String(this.EditionForm.get('nome')?.value || '').trim(),
      telefone: this.onlyDigits(this.EditionForm.get('telefone')?.value),
    };

    this.homeService.updateItem(this.id, payload).subscribe({
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
