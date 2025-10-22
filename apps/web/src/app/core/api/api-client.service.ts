/**
 * API Client Service
 * Cliente HTTP tipado para comunicación con el backend
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  LoginResponse,
  EmailDto,
} from '@atom-challenge/shared';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1`;

  // ============ Users ============

  /**
   * Login por email
   */
  login(email: string): Observable<LoginResponse> {
    const body: EmailDto = { email };
    return this.http.post<LoginResponse>(`${this.baseUrl}/users/login`, body);
  }

  /**
   * Crear nuevo usuario
   */
  createUser(email: string): Observable<LoginResponse> {
    const body: EmailDto = { email };
    return this.http.post<LoginResponse>(`${this.baseUrl}/users`, body);
  }

  // ============ Tasks ============

  /**
   * Listar tareas del usuario autenticado
   */
  listTasks(limit = 50): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`, {
      params: { limit: limit.toString() },
    });
  }

  /**
   * Crear nueva tarea
   */
  createTask(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, dto);
  }

  /**
   * Actualizar tarea
   */
  updateTask(id: string, dto: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, dto);
  }

  /**
   * Eliminar tarea
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }
}
