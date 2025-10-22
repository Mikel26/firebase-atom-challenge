import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/auth.service';

/**
 * Guard que redirige a /tasks si ya está autenticado
 */
const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkAuth()) {
    return router.createUrlTree(['/tasks']);
  }

  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPageComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/tasks.page').then((m) => m.TasksPageComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
