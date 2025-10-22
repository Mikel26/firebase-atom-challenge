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
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  readonly data = inject<{ email: string }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
}
