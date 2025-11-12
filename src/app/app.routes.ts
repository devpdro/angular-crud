import { Routes } from '@angular/router';

import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('src/app/pages/auth/auth.component').then((m) => m.AuthComponent),
    title: 'Login',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('src/app/pages/signup/signup.component').then((m) => m.SignupComponent),
    title: 'Cadastro',
  },
  {
    path: 'menu',
    loadComponent: () => import('src/app/pages/menu/menu.component').then((m) => m.MenuComponent),
    title: 'Dashboard',
    children: [
      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full',
      },
      {
        path: 'clientes',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('src/app/pages/customers/customers.component').then((m) => m.HomeComponent),
            title: 'Clientes',
          },
          {
            path: 'novo',
            loadComponent: () =>
              import('src/app/pages/registration/registration.component').then(
                (m) => m.RegistrationComponent
              ),
            title: 'Novo Cliente',
          },
          {
            path: 'editar/:id',
            loadComponent: () =>
              import('src/app/pages/edition/edition.component').then((m) => m.EditionComponent),
            title: 'Editar Cliente',
          },
        ],
      },
    ],
  },
];
