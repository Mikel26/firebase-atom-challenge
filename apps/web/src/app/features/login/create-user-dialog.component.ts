/**
 * Create User Dialog
 * Diálogo de confirmación para crear nuevo usuario
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Usuario no encontrado</h2>
    <mat-dialog-content>
      <p>
        El email <strong>{{ data.email }}</strong> no está registrado.
      </p>
      <p>¿Deseas crear una nueva cuenta?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">Crear Cuenta</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        padding: 20px 0;
      }

      p {
        margin: 8px 0;
      }
    `,
  ],
})
export class CreateUserDialogComponent {
  readonly data = inject<{ email: string }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
}
