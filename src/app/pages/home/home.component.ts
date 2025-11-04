import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { PaginatorModule } from 'primeng/paginator';

import { Subscription } from 'rxjs';

import { ButtonComponent, InputComponent, ClientModalComponent } from 'src/app/components';
import { isValidCPFLength, isValidTelefoneLength } from 'src/app/utilities';
import { HomeService, Client } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    DialogModule,
    PaginatorModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.module.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  private subscription = new Subscription();

  // Paginação (frontend)
  first = 0;
  rows = 10;
  rowsOptions = [10, 20, 50];
  pagedClients: Client[] = [];

  cpf = '';
  nome = '';
  telefone = '';

  error: string | null = null;

  constructor(private homeService: HomeService, private dialog: Dialog) {}

  ngOnInit(): void {
    // Carrega lista inicial do backend
    console.log('[Home] ngOnInit: solicitando lista de clientes');
    this.subscription.add(
      this.homeService.getAll().subscribe({
        next: (clients) => {
          console.log('[Home] getAll next', clients);
          this.clients = clients; // serviço já normaliza para array
          this.updatePaged();
        },
        error: (error) => {
          console.error('[Home] getAll error', error);
          // Em caso de erro, mantém estado atual (lista vazia)
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
      this.error = 'Telefone deve ter 11 dígitos.';
      return;
    }

    try {
      console.log('[Home] add payload', {
        cpf: this.cpf,
        nome: this.nome.trim(),
        telefone: this.telefone,
      });
      this.subscription.add(
        this.homeService
          .add({
            cpf: this.cpf,
            nome: this.nome.trim(),
            telefone: this.telefone,
          })
          .subscribe(
            (created) => {
              console.log('[Home] add created', created);
              this.clients = [...this.clients, created];
              this.resetForm();
            },
            (error) => {
              console.error('[Home] add error', error);
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
    console.log('[Home] handleList: solicitando lista de clientes');
    this.subscription.add(
      this.homeService.getAll().subscribe({
        next: (clients) => {
          console.log('[Home] handleList next', clients);
          this.clients = clients;
          // mantém posição atual, mas revalida limites
          const maxFirst = Math.max(0, this.clients.length - (this.clients.length % this.rows));
          if (this.first >= this.clients.length) {
            this.first = Math.min(this.first, maxFirst);
          }
          this.updatePaged();
        },
        error: (error) => {
          console.error('[Home] handleList error', error);
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
    console.log('[Home] remove: iniciando', id);
    const prev = this.clients;
    this.clients = this.clients.filter((p) => p.id !== id);
    this.updatePaged();
    this.subscription.add(
      this.homeService.remove(id).subscribe(
        () => {
          console.log('[Home] remove: concluído', id);
        },
        (error) => {
          console.error('[Home] remove error', error);
          this.error = 'Erro ao remover dados. Tente novamente.';
          this.clients = prev; // rollback se falhar
          this.updatePaged();
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

  // Helpers de paginação
  private updatePaged() {
    this.pagedClients = this.clients.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: { first: number; rows: number; page: number; pageCount: number }) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaged();
  }
}
