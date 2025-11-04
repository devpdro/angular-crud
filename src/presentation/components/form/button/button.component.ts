import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonStyle = 'btn1' | 'btn2' | 'btn3' | 'btn4' | 'btn5';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.module.scss'],
})
export class ButtonComponent {
  @Input() typeStyle: ButtonStyle = 'btn1';
  @Input() label = '';
  @Input() icon?: string;
  @Input() iconClass?: string;
  @Input() color?: string;
  @Input() textColor?: string;
  @Input() width: string | undefined;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() appClick = new EventEmitter<void>();

  onClick() {
    if (this.disabled) return;
    this.appClick.emit();
  }
}
