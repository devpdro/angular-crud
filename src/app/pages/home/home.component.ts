import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

import { ButtonComponent, InputComponent } from 'src/app/components';
import { isValidCPFLength, isValidTelefoneLength } from 'src/app/utilities';
import { HomeService } from 'src/app/pages/home/home.service';

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
    TableModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.module.scss'],
})
export class HomeComponent implements OnInit {
  cpf: string = '';
  nome: string = '';
  telefone: string = '';
  content: any = '';
  clients: any = [];
  error: string | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {}

  loadItens($event: any) {
    console.log('[Home] pageChange', $event);

    let first = $event.first === undefined ? 0 : $event.first;
    let limit = $event.rows ?? 10;
    let page = first / limit;
    let orderby = $event.sortField || 'nome';
    let val_order = $event.sortOrder;
    let direction = 'asc';
    let content = this.content;

    console.log('Página:', page);
    console.log('Limite por página:', limit);
    console.log('Ordenar por:', orderby);
    console.log('Direção:', direction);

    if (val_order === 1) {
      direction = 'asc';
    } else {
      direction = 'desc';
    }

    this.homeService.getItems(page + 1, limit, orderby, direction, content).subscribe({
      next: (items) => {
        console.log('[Home] getItems next', items);
        this.clients = items;
      },
      error: (error) => {
        console.error('[Home] getItems error', error);
        this.error = 'Erro ao carregar dados. Tente novamente.';
      },
    });
  }

  list() {}

  addItem() {
    console.log('[Home] addItem click', {
      cpf: this.cpf,
      nome: this.nome,
      telefone: this.telefone,
    });
    if (!isValidCPFLength(this.cpf)) {
      console.warn('[Home] addItem validation: CPF inválido');
      this.error = 'CPF inválido. Deve conter 11 dígitos numéricos.';
      return;
    }
    if (!isValidTelefoneLength(this.telefone)) {
      console.warn('[Home] addItem validation: Telefone inválido');
      this.error = 'Telefone inválido. Deve conter 11 dígitos numéricos.';
      return;
    }
    console.log('[Home] addItem validation passed');
    this.addItemAPI();
  }

  addItemAPI() {
    this.homeService
      .createItem({
        cpf: this.cpf,
        nome: this.nome.trim(),
        telefone: this.telefone,
      })
      .subscribe({
        next: (created) => {
          console.log('[Home] addItemAPI created', created);
          this.clients = [...this.clients, created];
          this.resetForm();
        },
        error: (error) => {
          console.error('[Home] addItemAPI error', error);
          this.error = 'Erro ao salvar dados. Tente novamente.';
        },
      });
  }

  private resetForm() {
    this.cpf = '';
    this.nome = '';
    this.telefone = '';
    this.error = null;
  }
}
