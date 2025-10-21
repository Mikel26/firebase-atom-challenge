import { z } from 'zod';

/**
 * DTO para crear una tarea
 */
export const CreateTaskDto = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede exceder 80 caracteres'),
  description: z.string().max(200, 'La descripción no puede exceder 200 caracteres').optional(),
});

/**
 * DTO para actualizar una tarea
 */
export const UpdateTaskDto = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede exceder 80 caracteres')
    .optional(),
  description: z.string().max(200, 'La descripción no puede exceder 200 caracteres').optional(),
  completed: z.boolean().optional(),
});

// Types inferidos de los schemas
export type CreateTaskDto = z.infer<typeof CreateTaskDto>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskDto>;
