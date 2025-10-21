'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LoginResponseSchema = exports.CreateUserDto = exports.EmailSchema = void 0;
const zod_1 = require('zod');
/**
 * Schema de validación para email
 */
exports.EmailSchema = zod_1.z.object({
  email: zod_1.z.string().email('Email inválido'),
});
/**
 * DTO para crear usuario (login por email)
 */
exports.CreateUserDto = exports.EmailSchema;
/**
 * DTO de respuesta con token JWT
 */
exports.LoginResponseSchema = zod_1.z.object({
  token: zod_1.z.string(),
  user: zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    createdAt: zod_1.z.string(),
  }),
});
//# sourceMappingURL=user.dto.js.map
