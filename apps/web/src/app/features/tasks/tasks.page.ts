/**
 * Tasks Page
 * Página principal de gestión de tareas
 */

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Task } from '@atom-challenge/shared';
import { ApiClient } from '../../core/api/api-client.service';
import { AuthService } from '../../core/auth/auth.service';
import { TaskItemComponent } from './task-item.component';
import { TaskEditorDialogComponent } from './task-editor-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    TaskItemComponent,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Mis Tareas</span>
      <span class="spacer"></span>
      <span class="user-email">{{ authService.currentUserEmail() }}</span>
      <button mat-icon-button (click)="onLogout()" aria-label="Cerrar sesión">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="container">
      <!-- Formulario para nueva tarea -->
      <mat-card class="add-task-card">
        <mat-card-content>
          <form [formGroup]="newTaskForm" (ngSubmit)="onCreateTask()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="title-field">
                <mat-label>Nueva tarea</mat-label>
                <input
                  matInput
                  formControlName="title"
                  placeholder="¿Qué necesitas hacer?"
                  [disabled]="creating()"
                />
                @if (
                  newTaskForm.get('title')?.hasError('required') &&
                  newTaskForm.get('title')?.touched
                ) {
                  <mat-error>El título es requerido</mat-error>
                }
                @if (newTaskForm.get('title')?.hasError('minlength')) {
                  <mat-error>Mínimo 3 caracteres</mat-error>
                }
                @if (newTaskForm.get('title')?.hasError('maxlength')) {
                  <mat-error>Máximo 80 caracteres</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="desc-field">
                <mat-label>Descripción (opcional)</mat-label>
                <input
                  matInput
                  formControlName="description"
                  placeholder="Detalles..."
                  [disabled]="creating()"
                />
                @if (newTaskForm.get('description')?.hasError('maxlength')) {
                  <mat-error>Máximo 200 caracteres</mat-error>
                }
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="newTaskForm.invalid || creating()"
                class="add-button"
              >
                @if (creating()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <mat-icon>add</mat-icon>
                  Agregar
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Loading inicial -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Cargando tareas...</p>
        </div>
      } @else if (tasks().length === 0) {
        <!-- Estado vacío -->
        <div class="empty-state">
          <mat-icon class="empty-icon">check_circle_outline</mat-icon>
          <h2>No hay tareas</h2>
          <p>¡Agrega tu primera tarea usando el formulario de arriba!</p>
        </div>
      } @else {
        <!-- Lista de tareas -->
        <div class="tasks-list">
          @for (task of tasks(); track task.id) {
            <app-task-item
              [task]="task"
              (toggle)="onToggleComplete($event)"
              (edit)="onEditTask($event)"
              (delete)="onDeleteTask($event)"
            ></app-task-item>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }

      .user-email {
        margin-right: 16px;
        font-size: 14px;
      }

      .container {
        max-width: 800px;
        margin: 24px auto;
        padding: 0 16px;
      }

      .add-task-card {
        margin-bottom: 24px;
      }

      .form-row {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .title-field {
        flex: 2;
      }

      .desc-field {
        flex: 3;
      }

      .add-button {
        margin-top: 4px;
        height: 56px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
      }

      .loading-container p {
        margin-top: 16px;
        color: rgba(0, 0, 0, 0.6);
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: rgba(0, 0, 0, 0.3);
        margin-bottom: 16px;
      }

      .empty-state h2 {
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 8px;
      }

      .empty-state p {
        color: rgba(0, 0, 0, 0.4);
      }

      .tasks-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      @media (max-width: 768px) {
        .form-row {
          flex-direction: column;
        }

        .title-field,
        .desc-field {
          flex: 1;
          width: 100%;
        }

        .add-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class TasksPageComponent implements OnInit {
  private readonly apiClient = inject(ApiClient);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly loading = signal(false);
  readonly creating = signal(false);
  readonly tasks = signal<Task[]>([]);

  readonly newTaskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    description: ['', [Validators.maxLength(200)]],
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);

    this.apiClient.listTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open(error.error?.message || 'Error al cargar tareas', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  onCreateTask(): void {
    if (this.newTaskForm.invalid) {
      return;
    }

    this.creating.set(true);
    const { title, description } = this.newTaskForm.value;

    this.apiClient.createTask({ title: title!, description: description || undefined }).subscribe({
      next: (task) => {
        // Optimistic UI: agregar al inicio
        this.tasks.update((tasks) => [task, ...tasks]);
        this.newTaskForm.reset();
        this.creating.set(false);
        this.snackBar.open('Tarea creada', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        this.creating.set(false);
        this.snackBar.open(error.error?.message || 'Error al crear tarea', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  onToggleComplete(task: Task): void {
    this.apiClient.updateTask(task.id, { completed: !task.completed }).subscribe({
      next: (updated) => {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
        this.snackBar.open(
          updated.completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
          'Cerrar',
          { duration: 2000 }
        );
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error al actualizar tarea', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskEditorDialogComponent, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiClient.updateTask(task.id, result).subscribe({
          next: (updated) => {
            this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
            this.snackBar.open('Tarea actualizada', 'Cerrar', { duration: 2000 });
          },
          error: (error) => {
            this.snackBar.open(error.error?.message || 'Error al actualizar tarea', 'Cerrar', {
              duration: 5000,
            });
          },
        });
      }
    });
  }

  onDeleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Tarea',
        message: `¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.deleteTaskConfirmed(task);
    });
  }

  private deleteTaskConfirmed(task: Task): void {
    this.apiClient.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error al eliminar tarea', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cerrar Sesión',
        message: '¿Estás seguro de que deseas cerrar sesión?',
        confirmText: 'Cerrar Sesión',
        cancelText: 'Cancelar',
        confirmColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }
}
