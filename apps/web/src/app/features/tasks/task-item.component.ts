/**
 * Task Item Component
 * Componente para mostrar una tarea individual
 */

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '@atom-challenge/shared';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card [class.completed]="task().completed">
      <mat-card-content class="task-content">
        <mat-checkbox
          [checked]="task().completed"
          (change)="toggle.emit(task())"
          color="primary"
          class="task-checkbox"
        >
          <div class="task-info">
            <h3 class="task-title">{{ task().title }}</h3>
            @if (task().description) {
              <p class="task-description">{{ task().description }}</p>
            }
            <span class="task-date">{{ task().createdAt | date: 'short' }}</span>
          </div>
        </mat-checkbox>

        <div class="task-actions">
          <button
            mat-icon-button
            (click)="edit.emit(task())"
            aria-label="Editar tarea"
            color="primary"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            (click)="delete.emit(task())"
            aria-label="Eliminar tarea"
            color="warn"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        margin-bottom: 12px;
        transition: all 0.3s ease;
      }

      mat-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      mat-card.completed {
        opacity: 0.7;
        background-color: #f5f5f5;
      }

      .task-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px !important;
      }

      .task-checkbox {
        flex: 1;
      }

      .task-info {
        margin-left: 8px;
      }

      .task-title {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .completed .task-title {
        text-decoration: line-through;
        color: rgba(0, 0, 0, 0.5);
      }

      .task-description {
        margin: 4px 0 0 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
      }

      .completed .task-description {
        color: rgba(0, 0, 0, 0.4);
      }

      .task-date {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        display: block;
        margin-top: 4px;
      }

      .task-actions {
        display: flex;
        gap: 4px;
      }
    `,
  ],
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly toggle = output<Task>();
  readonly edit = output<Task>();
  readonly delete = output<Task>();
}
