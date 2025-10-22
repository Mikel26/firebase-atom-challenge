/**
 * Token Storage Service
 * Manejo de JWT en localStorage
 */

import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  /**
   * Guardar token en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Obtener token de localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Eliminar token de localStorage
   */
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Verificar si hay token guardado
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}
