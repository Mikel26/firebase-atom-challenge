/**
 * Tasks Repository Interface
 * Define contrato para acceso a datos de tareas
 */

import { Task } from '@atom-challenge/shared';

/**
 * Interface del repositorio de tareas
 */
export interface TasksRepository {
  /**
   * Lista todas las tareas de un usuario
   * Ordenadas por createdAt descendente
   */
  findByUserId(userId: string, limit?: number): Promise<Task[]>;

  /**
   * Encuentra una tarea por ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Crea una nueva tarea
   */
  create(userId: string, title: string, description?: string): Promise<Task>;

  /**
   * Actualiza una tarea
   */
  update(
    id: string,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
    }
  ): Promise<Task | null>;

  /**
   * Elimina una tarea
   */
  delete(id: string): Promise<boolean>;
}
