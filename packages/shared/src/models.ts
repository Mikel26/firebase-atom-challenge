/**
 * Domain Models
 * Tipos compartidos entre frontend y backend
 */

/**
 * Usuario del sistema
 */
export interface User {
  /** ID único del usuario (auth uid o email hash) */
  id: string;

  /** Email del usuario */
  email: string;

  /** Fecha de creación en formato ISO */
  createdAt: string;
}

/**
 * Tarea del sistema
 */
export interface Task {
  /** ID único de la tarea */
  id: string;

  /** ID del usuario propietario */
  userId: string;

  /** Título de la tarea (3-80 caracteres) */
  title: string;

  /** Descripción opcional de la tarea (máx 200 caracteres) */
  description?: string;

  /** Fecha de creación en formato ISO */
  createdAt: string;

  /** Indica si la tarea está completada */
  completed: boolean;
}
