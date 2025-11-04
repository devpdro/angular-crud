import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/presentation/components/form/button/button.component';
import { InputComponent } from 'src/presentation/components/form/input/input.component';
import { Pessoa } from 'src/services/pessoa.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

type ModalMode = 'view' | 'edit';

@Component({
  selector: 'app-person-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.module.scss']
})
export class PersonModalComponent {
  mode: ModalMode = 'view';
  edited: Pessoa = { id: 0, nome: '', cpf: '', telefone: '' };
  idStr = '';

  constructor(
    private ref: DialogRef<Pessoa>,
    @Inject(DIALOG_DATA) public data: { mode: ModalMode; pessoa: Pessoa }
  ) {
    if (data) {
      this.mode = data.mode;
      this.edited = { ...data.pessoa };
      this.idStr = String(this.edited.id ?? '');
    }
  }

  close() {
    this.ref.close();
  }

  save() {
    this.ref.close(this.edited);
  }
}