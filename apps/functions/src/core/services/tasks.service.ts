/**
 * Tasks Service
 * Lógica de negocio para tareas con ownership
 */

import { Task } from '@atom-challenge/shared';
import { TasksRepository } from '../repositories/tasks.repository';

/**
 * Servicio de tareas
 */
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  /**
   * Lista todas las tareas de un usuario
   */
  async listByUser(userId: string, limit = 50): Promise<Task[]> {
    return this.tasksRepository.findByUserId(userId, limit);
  }

  /**
   * Obtiene una tarea por ID verificando ownership
   * @throws Error si la tarea no pertenece al usuario
   */
  async getById(taskId: string, userId: string): Promise<Task | null> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      return null;
    }

    // Verificar ownership
    if (task.userId !== userId) {
      throw new Error('No tienes permiso para acceder a esta tarea');
    }

    return task;
  }

  /**
   * Crea una nueva tarea
   */
  async create(userId: string, title: string, description?: string): Promise<Task> {
    return this.tasksRepository.create(userId, title, description);
  }

  /**
   * Actualiza una tarea verificando ownership
   * @throws Error si la tarea no pertenece al usuario
   */
  async update(
    taskId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
    }
  ): Promise<Task | null> {
    // Verificar que la tarea existe y pertenece al usuario
    const existing = await this.getById(taskId, userId);

    if (!existing) {
      return null;
    }

    return this.tasksRepository.update(taskId, data);
  }

  /**
   * Elimina una tarea verificando ownership
   * @throws Error si la tarea no pertenece al usuario
   */
  async delete(taskId: string, userId: string): Promise<boolean> {
    // Verificar que la tarea existe y pertenece al usuario
    const existing = await this.getById(taskId, userId);

    if (!existing) {
      return false;
    }

    return this.tasksRepository.delete(taskId);
  }
}
