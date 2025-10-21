/**
 * JWT Utilities
 * Manejo de tokens JWT para autenticación
 */

import jwt from 'jsonwebtoken';

/**
 * Payload del JWT
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

/**
 * Secret para firmar JWT
 * En producción debería venir de variables de entorno
 */
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

/**
 * Duración del token (7 días)
 */
const JWT_EXPIRATION = '7d';

/**
 * Genera un JWT token
 */
export function signToken(userId: string, email: string): string {
  const payload: JwtPayload = {
    sub: userId,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

/**
 * Verifica y decodifica un JWT token
 * @throws Error si el token es inválido o expiró
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido');
    }
    throw new Error('Error al verificar token');
  }
}
