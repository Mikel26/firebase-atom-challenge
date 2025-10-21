/**
 * Auth Guard
 * Protege rutas que requieren autenticación
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkAuth()) {
    return true;
  }

  // Redirigir a login si no está autenticado
  return router.createUrlTree(['/login']);
};
