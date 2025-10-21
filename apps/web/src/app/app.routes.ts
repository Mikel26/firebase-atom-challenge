import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Las rutas de features se añadirán en PRs posteriores
  // {
  //   path: 'login',
  //   loadComponent: () => import('./features/login/login.page').then(m => m.LoginPage)
  // },
  // {
  //   path: 'tasks',
  //   loadComponent: () => import('./features/tasks/tasks.page').then(m => m.TasksPage),
  //   canActivate: [authGuard]
  // },
  {
    path: '**',
    redirectTo: 'login',
  },
];

