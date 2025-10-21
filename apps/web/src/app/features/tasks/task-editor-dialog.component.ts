/**
 * Task Editor Dialog Component
 * Diálogo para editar una tarea existente
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task, UpdateTaskDto } from '@atom-challenge/shared';

@Component({
  selector: 'app-task-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>Editar Tarea</h2>

    <mat-dialog-content>
      <form [formGroup]="editForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" />
          @if (editForm.get('title')?.hasError('required') && editForm.get('title')?.touched) {
            <mat-error>El título es requerido</mat-error>
          }
          @if (editForm.get('title')?.hasError('minlength')) {
            <mat-error>Mínimo 3 caracteres</mat-error>
          }
          @if (editForm.get('title')?.hasError('maxlength')) {
            <mat-error>Máximo 80 caracteres</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
          @if (editForm.get('description')?.hasError('maxlength')) {
            <mat-error>Máximo 200 caracteres</mat-error>
          }
        </mat-form-field>

        <mat-checkbox formControlName="completed" color="primary"> Tarea completada </mat-checkbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="null">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="editForm.invalid" (click)="onSave()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      mat-dialog-content {
        padding: 20px 0;
        min-width: 400px;
      }

      mat-checkbox {
        margin-bottom: 16px;
      }
    `,
  ],
})
export class TaskEditorDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject<{ task: Task }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<TaskEditorDialogComponent>);

  readonly editForm = this.fb.group({
    title: [
      this.data.task.title,
      [Validators.required, Validators.minLength(3), Validators.maxLength(80)],
    ],
    description: [this.data.task.description || '', [Validators.maxLength(200)]],
    completed: [this.data.task.completed],
  });

  onSave(): void {
    if (this.editForm.invalid) {
      return;
    }

    const dto: UpdateTaskDto = {
      title: this.editForm.value.title!,
      description: this.editForm.value.description || undefined,
      completed: this.editForm.value.completed || false,
    };

    this.dialogRef.close(dto);
  }
}
