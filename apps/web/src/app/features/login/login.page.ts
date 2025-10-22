/**
 * Login Page
 * Página de login por email con opción de crear usuario
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/auth/auth.service';
import { CreateUserDialogComponent } from './create-user-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly loading = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    const email = this.loginForm.value.email!;

    this.authService.login(email).subscribe({
      next: () => {
        this.snackBar.open('¡Bienvenido!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.loading.set(false);

        // Si el usuario no existe (404), abrir diálogo para crear
        if (error.status === 404) {
          this.openCreateUserDialog(email);
        } else {
          this.snackBar.open(error.error?.message || 'Error al iniciar sesión', 'Cerrar', {
            duration: 5000,
          });
        }
      },
    });
  }

  private openCreateUserDialog(email: string): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px',
      data: { email },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.createUser(email);
      }
    });
  }

  private createUser(email: string): void {
    this.loading.set(true);

    this.authService.createUser(email).subscribe({
      next: () => {
        this.snackBar.open('¡Cuenta creada exitosamente!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open(error.error?.message || 'Error al crear usuario', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }
}
