/**
 * Tasks Controller
 * Endpoints de tareas
 */

import { Response } from 'express';
import { CreateTaskDto, UpdateTaskDto } from '@atom-challenge/shared';
import { AuthRequest } from '../middleware/auth';
import { TasksService } from '../core/services/tasks.service';
import { FirestoreTasksRepository } from '../infra/repositories/tasks.repository';

// Instanciar servicio (Dependency Injection simple)
const tasksRepository = new FirestoreTasksRepository();
const tasksService = new TasksService(tasksRepository);

/**
 * GET /api/tasks
 * Listar tareas del usuario autenticado
 */
export async function list(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const tasks = await tasksService.listByUser(req.user.sub, limit);

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al listar tareas:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al listar tareas',
    });
  }
}

/**
 * POST /api/tasks
 * Crear nueva tarea
 */
export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    // Validar request body con Zod
    const result = CreateTaskDto.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Datos inválidos',
        details: result.error.errors,
      });
      return;
    }

    const { title, description } = result.data;

    // Crear tarea
    const task = await tasksService.create(req.user.sub, title, description);

    res.status(201).json(task);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al crear tarea',
    });
  }
}

/**
 * PATCH /api/tasks/:id
 * Actualizar tarea
 */
export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    const { id } = req.params;

    // Validar request body con Zod
    const result = UpdateTaskDto.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Datos inválidos',
        details: result.error.errors,
      });
      return;
    }

    // Actualizar tarea (verifica ownership en el service)
    const task = await tasksService.update(id, req.user.sub, result.data);

    if (!task) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Tarea no encontrada',
      });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);

    // Error de ownership
    if (error instanceof Error && error.message.includes('No tienes permiso')) {
      res.status(403).json({
        error: 'Forbidden',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al actualizar tarea',
    });
  }
}

/**
 * DELETE /api/tasks/:id
 * Eliminar tarea
 */
export async function remove(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    const { id } = req.params;

    // Eliminar tarea (verifica ownership en el service)
    const deleted = await tasksService.delete(id, req.user.sub);

    if (!deleted) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Tarea no encontrada',
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);

    // Error de ownership
    if (error instanceof Error && error.message.includes('No tienes permiso')) {
      res.status(403).json({
        error: 'Forbidden',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al eliminar tarea',
    });
  }
}
