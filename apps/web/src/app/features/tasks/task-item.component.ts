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
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly toggle = output<Task>();
  readonly edit = output<Task>();
  readonly delete = output<Task>();
}
