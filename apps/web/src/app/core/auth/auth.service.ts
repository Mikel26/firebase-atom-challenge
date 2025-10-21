/**
 * Authentication Service
 * Manejo de autenticación y estado del usuario
 */

import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiClient } from '../api/api-client.service';
import { TokenStorageService } from './token-storage.service';
import { LoginResponse } from '@atom-challenge/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiClient = inject(ApiClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  // Estado reactivo
  readonly isAuthenticated = signal<boolean>(this.tokenStorage.hasToken());
  readonly currentUserEmail = signal<string | null>(null);

  /**
   * Login por email
   */
  login(email: string): Observable<LoginResponse> {
    return this.apiClient.login(email).pipe(
      tap((response) => {
        this.tokenStorage.saveToken(response.token);
        this.currentUserEmail.set(response.user.email);
        this.isAuthenticated.set(true);
      })
    );
  }

  /**
   * Crear nuevo usuario
   */
  createUser(email: string): Observable<LoginResponse> {
    return this.apiClient.createUser(email).pipe(
      tap((response) => {
        this.tokenStorage.saveToken(response.token);
        this.currentUserEmail.set(response.user.email);
        this.isAuthenticated.set(true);
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this.tokenStorage.removeToken();
    this.currentUserEmail.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  /**
   * Verificar si está autenticado
   */
  checkAuth(): boolean {
    return this.tokenStorage.hasToken();
  }
}
