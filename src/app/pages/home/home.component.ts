import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ButtonComponent } from 'src/app/components';
import { HomeService } from 'src/app/pages/home/home.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
    DialogModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule,
    FloatLabelModule,
    MessageModule,
    ToastModule,
    ConfirmDialog,
    NgxMaskDirective,
  ],
  providers: [MessageService, ConfirmationService, provideNgxMask()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.module.scss'],
})
export class HomeComponent implements OnInit {
  ClientForm!: FormGroup;
  SearchForm!: FormGroup;

  mensagemConfirmacao: boolean = true;
  mensagemSucesso: boolean = false;
  exibirDialogo: boolean = false;
  selectedId: number | null = null;
  selectedRow: any | null = null;
  cpf: string = '';
  nome: string = '';
  telefone: string = '';
  content: any = '';
  mensagem: string = '';

  filtros: filtros[] | undefined;
  selectedFiltros: filtros | undefined;
  clients: { data: any[]; total: number } = { data: [], total: 0 };
  error: string | null = null;
  loading: boolean = false;
  saving: boolean = false;

  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.filtros = [
      { name: 'Nome', code: 'nome' },
      { name: 'Cpf', code: 'cpf' },
      { name: 'Telefone', code: 'telefone' },
    ];
    this.ClientForm = this.fb.group({
      id: new FormControl(0),
      nome: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, this.cpfValidator()]),
      telefone: new FormControl('', [Validators.required, this.phoneValidator()]),
    });
    this.SearchForm = this.fb.group({
      filtros: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }

  private getErrorMessage(error: any): string {
    const e = error?.error;
    const errs = e?.errors || e;
    const cpfMsg = errs?.cpf?.[0] || errs?.cpf;
    const nomeMsg = errs?.nome?.[0] || errs?.nome;
    const telMsg = errs?.telefone?.[0] || errs?.telefone;

    if (cpfMsg) return 'CPF já cadastrado';
    if (nomeMsg) return typeof nomeMsg === 'string' ? nomeMsg : 'Nome inválido';
    if (telMsg) return typeof telMsg === 'string' ? telMsg : 'Telefone inválido';

    if (typeof e?.message === 'string' && e.message.trim()) return e.message;
    if (typeof error?.message === 'string' && error.message.trim()) return 'Erro ao salvar dados.';
    return 'Erro ao salvar dados. Tente novamente.';
  }

  private onlyDigits(v: any): string {
    return String(v ?? '').replace(/\D/g, '');
  }

  formatCpf(v: any): string {
    const d = this.onlyDigits(v).slice(0, 11);
    if (d.length !== 11) return v ?? '';
    return `${d.substring(0, 3)}.${d.substring(3, 6)}.${d.substring(6, 9)}-${d.substring(9, 11)}`;
  }

  formatPhone(v: any): string {
    const d = this.onlyDigits(v).slice(0, 11);
    if (d.length === 11) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 7)}-${d.substring(7, 11)}`;
    }
    if (d.length === 10) {
      return `(${d.substring(0, 2)}) ${d.substring(2, 6)}-${d.substring(6, 10)}`;
    }
    return v ?? '';
  }

  private cpfValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const d = this.onlyDigits(control.value);
      if (d.length !== 11) return { cpfInvalid: true };
      if (/^(\d)\1{10}$/.test(d)) return { cpfInvalid: true };
      return null;
    };
  }

  private phoneValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const d = this.onlyDigits(control.value);
      if (d.length !== 10 && d.length !== 11) return { phoneInvalid: true };
      return null;
    };
  }

  loadItens($event: any) {
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
        console.log('[Home] getItems next', items);
        this.clients = Array.isArray(items) ? { data: items, total: items.length } : (items as any);
        this.loading = false;
      },
      error: (error) => {
        console.error('[Home] getItems error', error);
        this.error = 'Erro ao carregar dados. Tente novamente.';
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

  addItem() {
    this.ClientForm.patchValue({
      id: 0,
      nome: '',
      cpf: '',
      telefone: '',
    });
    this.ClientForm.markAsPristine();
    this.ClientForm.markAsUntouched();
    this.error = null;
    this.exibirDialogo = true;
  }

  addItemAPI() {
    this.saving = true;
    this.homeService
      .createItem({
        cpf: this.onlyDigits(this.ClientForm.get('cpf')?.value),
        nome: this.ClientForm.get('nome')?.value.trim(),
        telefone: this.onlyDigits(this.ClientForm.get('telefone')?.value),
      })
      .subscribe({
        next: (created) => {
          console.log('[Home] addItemAPI created', created);
          this.clients.data = [...(this.clients.data || []), created];
          this.exibirDialogo = false;
          this.saving = false;
        },
        error: (error) => {
          console.error('Erro ao salvar dados', error);
          this.applyServerFieldErrors(error);
          this.error = this.getErrorMessage(error);
          this.saving = false;
        },
      });
  }

  updateItemAPI() {
    this.saving = true;
    this.homeService
      .updateItem(this.ClientForm.value.id, {
        nome: this.ClientForm.value.nome,
        cpf: this.onlyDigits(this.ClientForm.value.cpf),
        telefone: this.onlyDigits(this.ClientForm.value.telefone),
      })
      .subscribe({
        next: (updated) => {
          this.clients.data = this.clients.data.filter(
            (item: any) => item.id != this.ClientForm.value.id
          );
          this.clients.data.unshift({
            id: this.ClientForm.value.id,
            nome: this.ClientForm.value.nome,
            cpf: this.ClientForm.value.cpf,
            telefone: this.ClientForm.value.telefone,
          });
          console.log('[Home] saveItem updateItem next', this.ClientForm.value);

          console.log(updated);
          this.exibirDialogo = false;
          this.selectedId = null;
          this.error = null;
          this.saving = false;
        },
        error: (error) => {
          console.error('[Home] saveItem updateItem error', error);
          this.applyServerFieldErrors(error);
          this.error = this.getErrorMessage(error);
          this.saving = false;
        },
      });
  }

  viewItem(id: number) {
    this.selectedId = id;
    this.homeService.getItem(id).subscribe({
      next: (item) => {
        console.log('[Home] viewItem next', item);
        this.ClientForm.patchValue({
          id: item.id,
          nome: item.nome,
          cpf: item.cpf,
          telefone: item.telefone,
        });
        this.ClientForm.disable({ emitEvent: false });
        this.exibirDialogo = true;
      },
      error: (error) => {
        console.error('[Home] viewItem error', error);
        this.error = 'Erro ao carregar dados. Tente novamente.';
      },
    });
  }

  editItem(item: any) {
    this.selectedId = item.id;
    console.log(item);
    this.homeService.getItem(item.id).subscribe({
      next: (item) => {
        console.log('[Home] editItem next', item);
        this.ClientForm.patchValue({
          id: item.id,
          nome: item.nome,
          cpf: item.cpf,
          telefone: item.telefone,
        });
        this.ClientForm.enable({ emitEvent: false });
        this.exibirDialogo = true;
      },
      error: (error) => {
        console.error('[Home] editItem error', error);
        this.error = 'Erro ao carregar dados. Tente novamente.';
      },
    });
  }

  saveItem() {
    if (this.ClientForm.get('id')?.value === 0) {
      this.addItemAPI();
    } else {
      this.updateItemAPI();
    }
  }

  messageConfirmDelete($event: any) {
    console.log('[Home] confirmDeletion confirm', $event);
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este registro?',
      header: 'Zona de perigo',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.excludeItem($event);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Item foi excluido',
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
        console.log('[Home] excludeItem next', id);
        this.clients.data = (this.clients.data || []).filter((client: any) => client.id !== id);
        this.clients.total = Math.max(0, (this.clients.total ?? 0) - 1);
      },
      error: (error) => {
        console.error('[Home] excludeItem error', error);
        this.error = 'Erro ao excluir dados. Tente novamente.';
      },
    });
  }

  private applyServerFieldErrors(error: any) {
    const errors = error?.error?.errors;
    if (!errors || typeof errors !== 'object') return;

    const map: Record<string, string> = {
      cpf: 'cpfTaken',
      nome: 'nomeServer',
      telefone: 'telefoneServer',
    };

    Object.keys(errors).forEach((field) => {
      const control = this.ClientForm.get(field);
      if (!control) return;
      const current = control.errors || {};
      const key = map[field] || 'server';
      control.setErrors({ ...current, [key]: true });
      control.markAsTouched();
    });
  }
}
