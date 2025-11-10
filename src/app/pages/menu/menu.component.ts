import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.module.scss'],
})
export class MenuComponent {
  constructor(private router: Router) {}

  navigateToClients() {
    // Navega para clientes dentro do layout do menu
    this.router.navigate(['/menu/home']);
  }

  logout() {
    // Aqui podemos limpar tokens/sessão se necessário e navegar para login
    this.router.navigate(['/']);
  }
}
