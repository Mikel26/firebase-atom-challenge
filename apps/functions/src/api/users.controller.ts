/**
 * Users Controller
 * Endpoints de usuarios
 */

import { Request, Response } from 'express';
import { EmailSchema } from '@atom-challenge/shared';
import { UsersService } from '../core/services/users.service';
import { FirestoreUsersRepository } from '../infra/repositories/users.repository';

// Instanciar servicio (Dependency Injection simple)
const usersRepository = new FirestoreUsersRepository();
const usersService = new UsersService(usersRepository);

/**
 * POST /api/users/login
 * Login por email
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    // Validar request body con Zod
    const result = EmailSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email inválido',
        details: result.error.errors,
      });
      return;
    }

    const { email } = result.data;

    // Intentar login
    const response = await usersService.login(email);

    if (!response) {
      // Usuario no existe
      res.status(404).json({
        error: 'Not Found',
        message: 'Usuario no encontrado. ¿Deseas crear una cuenta?',
      });
      return;
    }

    // Login exitoso
    res.status(200).json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al procesar login',
    });
  }
}

/**
 * POST /api/users
 * Crear nuevo usuario
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    // Validar request body con Zod
    const result = EmailSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email inválido',
        details: result.error.errors,
      });
      return;
    }

    const { email } = result.data;

    // Crear usuario
    const response = await usersService.createUser(email);

    // Usuario creado exitosamente
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al crear usuario:', error);

    // Error específico: usuario ya existe
    if (error instanceof Error && error.message === 'El usuario ya existe') {
      res.status(409).json({
        error: 'Conflict',
        message: error.message,
      });
      return;
    }

    // Error genérico
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al crear usuario',
    });
  }
}
