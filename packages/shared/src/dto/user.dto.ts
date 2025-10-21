import { z } from 'zod';

/**
 * Schema de validación para email
 */
export const EmailSchema = z.object({
  email: z.string().email('Email inválido'),
});

/**
 * DTO para crear usuario (login por email)
 */
export const CreateUserDto = EmailSchema;

/**
 * DTO de respuesta con token JWT
 */
export const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
  }),
});

// Types inferidos de los schemas
export type EmailDto = z.infer<typeof EmailSchema>;
export type CreateUserDto = z.infer<typeof CreateUserDto>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
