import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonStyle = 'btn1' | 'icon-btn';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.module.scss'],
})
export class ButtonComponent {
  @Input() typeStyle: ButtonStyle = 'btn1';
  @Input() width?: string;
  @Input() disabled = false;
  @Input() label = '';
  @Input() icon?: string;
  @Input() iconClass?: string;
  @Input() color?: string;
  @Input() textColor?: string = '#fff';
  @Input() border?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() appClick = new EventEmitter<void>();


  @Input() loading = false;
  @Input() loadingLabel = 'Carregando...';
  @Input() loadingIconClass = 'ti ti-loader-2 spin';
  @Input() autoLoadingOnClick = true;
  @Output() loadingChange = new EventEmitter<boolean>();

  onClick() {
    if (this.disabled || this.loading) return;
    const shouldAutoLoad = this.autoLoadingOnClick && this.typeStyle !== 'icon-btn';
    if (shouldAutoLoad) {
      this.loading = true;
      this.loadingChange.emit(true);
    }
    this.appClick.emit();
  }
}
