/**
 * Confirm Dialog Component
 * Diálogo de confirmación reutilizable con Material Design
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-icon">warning</mat-icon>
      {{ data.title }}
    </h2>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelText || 'Cancelar' }}
      </button>
      <button mat-raised-button [color]="data.confirmColor || 'warn'" [mat-dialog-close]="true">
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-icon {
        vertical-align: middle;
        margin-right: 8px;
        color: #f44336;
      }

      h2 {
        display: flex;
        align-items: center;
      }

      mat-dialog-content {
        padding: 20px 0;
        min-width: 300px;
      }

      p {
        margin: 0;
        line-height: 1.5;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
}
