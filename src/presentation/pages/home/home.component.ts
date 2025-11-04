import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { ButtonComponent } from 'src/presentation/components/form/button/button.component';
import { InputComponent } from 'src/presentation/components/form/input/input.component';
import { PessoaService, Pessoa } from 'src/services/pessoa.service';
import { PersonModalComponent } from 'src/presentation/components/modal/person-modal/person-modal.component';

import { Subscription } from 'rxjs';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const isValidCPFLength = (value: string) => onlyDigits(value).length === 11;
const isValidTelefoneLength = (value: string) => {
  const len = onlyDigits(value).length;
  return len === 10 || len === 11;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, DialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.module.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  pessoas: Pessoa[] = [
    { id: 1, cpf: '123.456.789-00', nome: 'Fulano de Tal', telefone: '(11) 98765-4321' }
  ];
  private subscription = new Subscription();

  cpf = '';
  nome = '';
  telefone = '';

  editingId: number | null = null;
  editCpf = '';
  editNome = '';
  editTelefone = '';

  error: string | null = null;

  constructor(private pessoaService: PessoaService, private dialog: Dialog) {}

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
    // Carrega lista inicial do servidor JSON
    this.subscription.add(
      this.pessoaService.getAll().subscribe({
        next: (pessoas) => {
          // Mantém o registro inicial se o backend retornar vazio
          if (Array.isArray(pessoas) && pessoas.length > 0) {
            this.pessoas = pessoas;
          }
        },
        error: () => {
          // Ignora erros para preservar os dados locais (seed)
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Máscaras agora via ngx-mask no template; removidos handlers manuais

  async handleAdd() {
    this.error = null;
    if (!this.nome.trim()) {
      this.error = 'Nome é obrigatório.';
      return;
    }
    if (!isValidCPFLength(this.cpf)) {
      this.error = 'CPF deve ter 11 dígitos.';
      return;
    }
    if (!isValidTelefoneLength(this.telefone)) {
      this.error = 'Telefone deve ter 10 ou 11 dígitos.';
      return;
    }

    try {
      this.subscription.add(
        this.pessoaService
          .add({
            cpf: this.cpf,
            nome: this.nome.trim(),
            telefone: this.telefone,
          })
          .subscribe(
            (created) => {
              this.pessoas = [...this.pessoas, created];
              this.resetForm();
            },
            () => {
              this.error = 'Erro ao salvar dados. Tente novamente.';
            }
          )
      );
    } catch (error) {
      this.error = 'Erro ao salvar dados. Tente novamente.';
    }
  }

  startEdit(p: Pessoa) {
    this.editingId = p.id;
    this.editCpf = p.cpf;
    this.editNome = p.nome;
    this.editTelefone = p.telefone;
    this.error = null;
    this.dialog.open(PersonModalComponent, {
      data: { mode: 'edit', pessoa: p },
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editCpf = '';
    this.editNome = '';
    this.editTelefone = '';
    this.error = null;
  }

  async saveEdit() {
    this.error = null;
    if (!this.editNome.trim()) {
      this.error = 'Nome é obrigatório.';
      return;
    }
    if (!isValidCPFLength(this.editCpf)) {
      this.error = 'CPF deve ter 11 dígitos.';
      return;
    }
    if (!isValidTelefoneLength(this.editTelefone)) {
      this.error = 'Telefone deve ter 10 ou 11 dígitos.';
      return;
    }

    if (this.editingId === null) return;

    try {
      this.subscription.add(
        this.pessoaService
          .update(this.editingId, {
            cpf: this.editCpf,
            nome: this.editNome.trim(),
            telefone: this.editTelefone,
          })
          .subscribe(
            (updated) => {
              this.pessoas = this.pessoas.map((p) => (p.id === this.editingId ? updated : p));
              this.cancelEdit();
            },
            () => {
              this.error = 'Erro ao atualizar dados. Tente novamente.';
            }
          )
      );
    } catch (error) {
      this.error = 'Erro ao atualizar dados. Tente novamente.';
    }
  }

  async remove(id: number) {
    this.subscription.add(
      this.pessoaService.remove(id).subscribe(
        () => {
          this.pessoas = this.pessoas.filter((p) => p.id !== id);
        },
        () => {
          this.error = 'Erro ao remover dados. Tente novamente.';
        }
      )
    );
  }

  view(pessoa: Pessoa) {
    this.dialog.open(PersonModalComponent, {
      data: { mode: 'view', pessoa },
    });
  }

  private resetForm() {
    this.cpf = '';
    this.nome = '';
    this.telefone = '';
    this.error = null;
  }
}
