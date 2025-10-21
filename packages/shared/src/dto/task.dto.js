'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateTaskDto = exports.CreateTaskDto = void 0;
const zod_1 = require('zod');
/**
 * DTO para crear una tarea
 */
exports.CreateTaskDto = zod_1.z.object({
  title: zod_1.z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede exceder 80 caracteres'),
  description: zod_1.z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional(),
});
/**
 * DTO para actualizar una tarea
 */
exports.UpdateTaskDto = zod_1.z.object({
  title: zod_1.z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(80, 'El título no puede exceder 80 caracteres')
    .optional(),
  description: zod_1.z
    .string()
    .max(200, 'La descripción no puede exceder 200 caracteres')
    .optional(),
  completed: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=task.dto.js.map
