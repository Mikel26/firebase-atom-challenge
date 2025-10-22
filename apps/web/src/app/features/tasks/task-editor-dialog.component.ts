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
  templateUrl: './task-editor-dialog.component.html',
  styleUrl: './task-editor-dialog.component.scss',
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
