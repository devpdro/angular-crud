import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../components/form/button/button.component';
import { InputComponent } from '../../components/form/input/input.component';

// (CSS Modules import removido; Angular usa styleUrls para estilos do componente)

type Pessoa = {
  id: number;
  cpf: string;
  nome: string;
  telefone: string;
};

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const isValidCPFLength = (value: string) => onlyDigits(value).length === 11;
const isValidTelefoneLength = (value: string) => {
  const len = onlyDigits(value).length;
  return len === 10 || len === 11;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.module.scss'],
})
export class HomeComponent implements OnInit {
  pessoas: Pessoa[] = [];

  cpf = '';
  nome = '';
  telefone = '';

  editingId: number | null = null;
  editCpf = '';
  editNome = '';
  editTelefone = '';

  error: string | null = null;

  // Máscara dinâmica para telefone (10 ou 11 dígitos)
  get phoneMask(): string {
    const len = onlyDigits(this.telefone).length;
    return len > 10 ? '(00) 00000-0000' : '(00) 0000-0000';
  }
  get editPhoneMask(): string {
    const len = onlyDigits(this.editTelefone).length;
    return len > 10 ? '(00) 00000-0000' : '(00) 0000-0000';
  }

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('pessoas');
      if (raw) this.pessoas = JSON.parse(raw);
    } catch {}
  }

  private persist() {
    try {
      localStorage.setItem('pessoas', JSON.stringify(this.pessoas));
    } catch {}
  }

  get nextId(): number {
    return this.pessoas.length ? Math.max(...this.pessoas.map((p) => p.id)) + 1 : 1;
  }

  // Máscaras agora via ngx-mask no template; removidos handlers manuais

  handleAdd(event: Event) {
    event.preventDefault();
    if (!this.nome.trim()) { this.error = 'Nome é obrigatório.'; return; }
    if (!isValidCPFLength(this.cpf)) { this.error = 'CPF deve ter 11 dígitos.'; return; }
    if (!isValidTelefoneLength(this.telefone)) { this.error = 'Telefone deve ter 10 ou 11 dígitos.'; return; }

    const novo: Pessoa = {
      id: this.nextId,
      cpf: this.cpf,
      nome: this.nome.trim(),
      telefone: this.telefone,
    };
    this.pessoas = [...this.pessoas, novo];
    this.persist();
    this.resetForm();
  }

  startEdit(p: Pessoa) {
    this.editingId = p.id;
    this.editCpf = p.cpf;
    this.editNome = p.nome;
    this.editTelefone = p.telefone;
    this.error = null;
  }

  cancelEdit() {
    this.editingId = null;
    this.editCpf = '';
    this.editNome = '';
    this.editTelefone = '';
    this.error = null;
  }

  saveEdit() {
    if (!this.editNome.trim()) { this.error = 'Nome é obrigatório.'; return; }
    if (!isValidCPFLength(this.editCpf)) { this.error = 'CPF deve ter 11 dígitos.'; return; }
    if (!isValidTelefoneLength(this.editTelefone)) { this.error = 'Telefone deve ter 10 ou 11 dígitos.'; return; }

    this.pessoas = this.pessoas.map((p) =>
      p.id === this.editingId
        ? {
            ...p,
            cpf: this.editCpf,
            nome: this.editNome.trim(),
            telefone: this.editTelefone,
          }
        : p,
    );
    this.persist();
    this.cancelEdit();
  }

  remove(id: number) {
    this.pessoas = this.pessoas.filter((p) => p.id !== id);
    this.persist();
  }

  private resetForm() {
    this.cpf = '';
    this.nome = '';
    this.telefone = '';
    this.error = null;
  }
}