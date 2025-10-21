/**
 * Authentication Middleware
 * Verifica JWT en las peticiones
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../core/auth/jwt';

/**
 * Request extendido con información del usuario autenticado
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware de autenticación
 * Verifica el token JWT en el header Authorization
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token de autenticación requerido',
      });
      return;
    }

    // Verificar formato Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Formato de token inválido. Use: Bearer <token>',
      });
      return;
    }

    const token = parts[1];

    // Verificar y decodificar token
    const payload = verifyToken(token);

    // Adjuntar payload al request
    req.user = payload;

    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al verificar token';
    res.status(401).json({
      error: 'Unauthorized',
      message,
    });
  }
}
