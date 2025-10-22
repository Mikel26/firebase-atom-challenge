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
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
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
