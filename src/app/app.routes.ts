import { Routes } from '@angular/router';

import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('src/app/pages/auth/auth.component').then((m) => m.AuthComponent),
    title: 'Login',
  },
  {
    path: '',
    loadComponent: () => import('src/app/pages/menu/menu.component').then((m) => m.MenuComponent),
    title: 'Dashboard',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('src/app/pages/registrations/customers/customers.component').then(
            (m) => m.HomeComponent
          ),
        title: 'Clientes',
      },
    ],
  },
];
