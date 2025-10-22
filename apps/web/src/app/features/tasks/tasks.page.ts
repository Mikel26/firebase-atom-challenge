/**
 * Tasks Page
 * Página principal de gestión de tareas
 */

import { Component, inject, OnInit } from '@angular/core';
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
import { BehaviorSubject, catchError, finalize, Observable, of, tap } from 'rxjs';
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

  // Observables para usar con async pipe
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  readonly tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private readonly creatingSubject = new BehaviorSubject<boolean>(false);
  readonly creating$: Observable<boolean> = this.creatingSubject.asObservable();

  readonly newTaskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    description: ['', [Validators.maxLength(200)]],
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * trackBy function para optimizar renderizado de lista
   */
  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  private loadTasks(): void {
    this.loadingSubject.next(true);

    this.apiClient
      .listTasks()
      .pipe(
        tap((tasks) => this.tasksSubject.next(tasks)),
        catchError((error) => {
          this.snackBar.open(error.error?.message || 'Error al cargar tareas', 'Cerrar', {
            duration: 5000,
          });
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  onCreateTask(): void {
    if (this.newTaskForm.invalid) {
      return;
    }

    this.creatingSubject.next(true);
    const { title, description } = this.newTaskForm.value;

    this.apiClient
      .createTask({ title: title!, description: description || undefined })
      .pipe(
        tap((task) => {
          // Optimistic UI: agregar al inicio
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([task, ...currentTasks]);
          this.newTaskForm.reset();
          this.snackBar.open('Tarea creada', 'Cerrar', { duration: 2000 });
        }),
        catchError((error) => {
          this.snackBar.open(error.error?.message || 'Error al crear tarea', 'Cerrar', {
            duration: 5000,
          });
          return of(null);
        }),
        finalize(() => this.creatingSubject.next(false))
      )
      .subscribe();
  }

  onToggleComplete(task: Task): void {
    this.apiClient
      .updateTask(task.id, { completed: !task.completed })
      .pipe(
        tap((updated) => {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next(currentTasks.map((t) => (t.id === updated.id ? updated : t)));
          this.snackBar.open(
            updated.completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
            'Cerrar',
            { duration: 2000 }
          );
        }),
        catchError((error) => {
          this.snackBar.open(error.error?.message || 'Error al actualizar tarea', 'Cerrar', {
            duration: 5000,
          });
          return of(null);
        })
      )
      .subscribe();
  }

  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskEditorDialogComponent, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiClient
          .updateTask(task.id, result)
          .pipe(
            tap((updated) => {
              const currentTasks = this.tasksSubject.value;
              this.tasksSubject.next(currentTasks.map((t) => (t.id === updated.id ? updated : t)));
              this.snackBar.open('Tarea actualizada', 'Cerrar', { duration: 2000 });
            }),
            catchError((error) => {
              this.snackBar.open(error.error?.message || 'Error al actualizar tarea', 'Cerrar', {
                duration: 5000,
              });
              return of(null);
            })
          )
          .subscribe();
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
    this.apiClient
      .deleteTask(task.id)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next(currentTasks.filter((t) => t.id !== task.id));
          this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 2000 });
        }),
        catchError((error) => {
          this.snackBar.open(error.error?.message || 'Error al eliminar tarea', 'Cerrar', {
            duration: 5000,
          });
          return of(null);
        })
      )
      .subscribe();
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
