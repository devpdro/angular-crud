import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { Subscription } from 'rxjs';

import { ButtonComponent, InputComponent, ClientModalComponent } from 'src/presentation/components';
import { ClientService, Client } from 'src/main/services';
import { isValidCPFLength, isValidTelefoneLength } from 'src/utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, DialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.module.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  clients: Client[] = [
    { id: 1, cpf: '123.456.789-00', nome: 'Fulano de Tal', telefone: '(11) 98765-4321' },
  ];
  private subscription = new Subscription();

  cpf = '';
  nome = '';
  telefone = '';

  error: string | null = null;

  constructor(private clientService: ClientService, private dialog: Dialog) {}

  ngOnInit(): void {
    // Carrega lista inicial do servidor JSON
    this.subscription.add(
      this.clientService.getAll().subscribe({
        next: (clients) => {
          // Mantém o registro inicial se o backend retornar vazio
          if (Array.isArray(clients) && clients.length > 0) {
            this.clients = clients;
          }
        },
        error: () => {
          // Ignora erros para preservar os dados locais (seed)
        },
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
      this.error = 'Telefone deve ter  11 dígitos.';
      return;
    }

    try {
      this.subscription.add(
        this.clientService
          .add({
            cpf: this.cpf,
            nome: this.nome.trim(),
            telefone: this.telefone,
          })
          .subscribe(
            (created) => {
              this.clients = [...this.clients, created];
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

  handleClear() {
    this.resetForm();
  }

  openFilters() {
    // Placeholder para futuros filtros; por enquanto sem ação
  }

  handleList() {
    this.subscription.add(
      this.clientService.getAll().subscribe({
        next: (clients) => {
          if (Array.isArray(clients)) {
            this.clients = clients;
          }
        },
        error: () => {
          // Mantém dados atuais em caso de erro
        },
      })
    );
  }

  startEdit(p: Client) {
    this.error = null;
    this.dialog.open(ClientModalComponent, {
      data: { mode: 'edit', cliente: p },
    });
  }

  async remove(id: number) {
    const prev = this.clients;
    this.clients = this.clients.filter((p) => p.id !== id);
    this.subscription.add(
      this.clientService.remove(id).subscribe(
        () => {},
        () => {
          this.error = 'Erro ao remover dados. Tente novamente.';
          this.clients = prev; // rollback se falhar
        }
      )
    );
  }

  view(pessoa: Client) {
    this.dialog.open(ClientModalComponent, {
      data: { mode: 'view', cliente: pessoa },
    });
  }

  private resetForm() {
    this.cpf = '';
    this.nome = '';
    this.telefone = '';
    this.error = null;
  }
}
