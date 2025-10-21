/**
 * Firestore Tasks Repository Implementation
 */

import { Task } from '@atom-challenge/shared';
import { TasksRepository } from '../../core/repositories/tasks.repository';
import { tasksCollection, generateId } from '../firestore';

/**
 * Implementación de TasksRepository con Firestore
 */
export class FirestoreTasksRepository implements TasksRepository {
  /**
   * Lista todas las tareas de un usuario
   * Ordenadas por createdAt descendente
   */
  async findByUserId(userId: string, limit = 50): Promise<Task[]> {
    let query = tasksCollection().where('userId', '==', userId).orderBy('createdAt', 'desc');

    if (limit > 0) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  }

  /**
   * Encuentra una tarea por ID
   */
  async findById(id: string): Promise<Task | null> {
    const doc = await tasksCollection().doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as Task;
  }

  /**
   * Crea una nueva tarea
   */
  async create(userId: string, title: string, description?: string): Promise<Task> {
    const id = generateId();
    const now = new Date().toISOString();

    const task: Task = {
      id,
      userId,
      title,
      description: description || '',
      createdAt: now,
      completed: false,
    };

    await tasksCollection().doc(id).set({
      userId: task.userId,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt,
      completed: task.completed,
    });

    return task;
  }

  /**
   * Actualiza una tarea
   */
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
    }
  ): Promise<Task | null> {
    const doc = await tasksCollection().doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const updateData: Partial<Task> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.completed !== undefined) updateData.completed = data.completed;

    await tasksCollection().doc(id).update(updateData);

    const updated = await tasksCollection().doc(id).get();
    return { id: updated.id, ...updated.data() } as Task;
  }

  /**
   * Elimina una tarea
   */
  async delete(id: string): Promise<boolean> {
    const doc = await tasksCollection().doc(id).get();

    if (!doc.exists) {
      return false;
    }

    await tasksCollection().doc(id).delete();
    return true;
  }
}
