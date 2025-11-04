import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

import { ButtonComponent, InputComponent } from 'src/app/components';

import { Client } from 'src/app/pages/home/home.service';

type ModalMode = 'view' | 'edit';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.module.scss'],
})
export class ClientModalComponent {
  mode: ModalMode = 'view';
  edited: Client = { id: 0, nome: '', cpf: '', telefone: '' };

  constructor(
    private ref: DialogRef<Client>,
    @Inject(DIALOG_DATA) public data: { mode: ModalMode; cliente: Client }
  ) {
    if (data) {
      this.mode = data.mode;
      this.edited = { ...data.cliente };
    }
  }

  close() {
    this.ref.close();
  }

  save() {
    this.ref.close(this.edited);
  }
}
