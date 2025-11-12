import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { HomeService } from 'src/app/pages/customers/customers.service';
import { LocalStoreService } from 'src/app/LocalStoreService/local-store.service';

interface filtros {
  name: string;
  code: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule,
    MessageModule,
    ToastModule,
    RouterModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.module.scss'],
})
export class HomeComponent implements OnInit {
  SearchForm!: FormGroup;

  mensagemConfirmacao: boolean = true;
  mensagemSucesso: boolean = false;
  selectedRow: any | null = null;
  content: any = '';
  mensagem: string = '';

  filtros: filtros[] | undefined;
  selectedFiltros: filtros | undefined;
  clients: { data: any[]; total: number } = { data: [], total: 0 };
  error: string | null = null;
  loading: boolean = false;
  saving: boolean = false;
  lastLazyEvent: any = null;

  permissaoAlterar: boolean = true;
  permissaoInserir: boolean = true;
  permissaoExcluir: boolean = true;

  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ls: LocalStoreService
  ) {}

  ngOnInit(): void {
    this.permissoes();
    this.filtros = [
      { name: 'Nome', code: 'nome' },
      { name: 'Cpf', code: 'cpf' },
      { name: 'Telefone', code: 'telefone' },
    ];
    this.SearchForm = this.fb.group({
      filtros: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }

  private onlyDigits(value: any): string {
    return String(value ?? '').replace(/\D/g, '');
  }

  formatCpf(value: any): string {
    const digits = this.onlyDigits(value).slice(0, 11);
    if (digits.length !== 11) return value ?? '';
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(
      6,
      9
    )}-${digits.substring(9, 11)}`;
  }

  formatPhone(value: any): string {
    const digits = this.onlyDigits(value).slice(0, 11);
    if (digits.length === 11) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
    }
    if (digits.length === 10) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6, 10)}`;
    }
    return value ?? '';
  }

  loadItens($event: any) {
    this.lastLazyEvent = $event;
    this.loading = true;
    let first = $event.first === undefined ? 0 : $event.first;
    let limit = $event.rows ?? 10;
    let page = first / limit;
    let orderby = $event.sortField || 'nome';
    let val_order = $event.sortOrder;
    let direction = 'asc';

    const searchVals = this.SearchForm?.value || {};
    const content = searchVals.content ?? this.content;
    const filtroVal = searchVals.filtros;
    const filterby =
      (typeof filtroVal === 'string' ? filtroVal : filtroVal?.code) ||
      this.selectedFiltros?.code ||
      'nome';

    if (val_order === 1) {
      direction = 'asc';
    } else {
      direction = 'desc';
    }

    this.homeService.getItems(page + 1, limit, orderby, direction, filterby, content).subscribe({
      next: (items) => {
        this.clients = Array.isArray(items) ? { data: items, total: items.length } : (items as any);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar dados. Tente novamente.';
        console.error('Erro ao carregar dados:', error);
        this.loading = false;
      },
    });
  }

  onListClick() {
    const searchVals = this.SearchForm?.value || {};
    const filtroVal = searchVals.filtros;
    const sortField = (typeof filtroVal === 'string' ? filtroVal : filtroVal?.code) || 'nome';
    const event = {
      first: 0,
      rows: 10,
      sortField: sortField,
      sortOrder: 1,
    };

    this.loadItens(event);
  }

  messageConfirmDelete(item: any) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o cliente "${item?.nome}"?`,
      header: 'Zona de perigo',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Excluir',
        severity: 'danger',
      },
      accept: () => {
        this.excludeItem(item?.id);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: `${item?.nome} foi excluído`,
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejeitado',
          detail: 'Operação cancelada',
        });
      },
    });
  }

  excludeItem(id: number) {
    this.homeService.deleteItem(id).subscribe({
      next: () => {
        this.clients.data = (this.clients.data || []).filter((client: any) => client.id !== id);
        this.clients.total = Math.max(0, (this.clients.total ?? 0) - 1);
      },
      error: (error) => {
        this.error = 'Erro ao excluir dados. Tente novamente.';
        return error;
      },
    });
  }

  permissoes() {
    let permissao = this.ls.getPermissaoBotao('clientes', 'editar');
    if (!permissao) {
      this.permissaoAlterar = false;
    }
    permissao = this.ls.getPermissaoBotao('clientes', 'criar');
    if (!permissao) {
      this.permissaoInserir = false;
    }
    permissao = this.ls.getPermissaoBotao('clientes', 'excluir');
    if (!permissao) {
      this.permissaoExcluir = false;
    }
  }

  can(botao: 'criar' | 'alterar' | 'excluir'): boolean {
    return this.ls.getPermissaoBotao('clientes', botao);
  }
}
