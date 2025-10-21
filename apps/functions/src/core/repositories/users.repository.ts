/**
 * Users Repository Interface
 * Define contrato para acceso a datos de usuarios
 */

import { User } from '@atom-challenge/shared';

/**
 * Interface del repositorio de usuarios
 */
export interface UsersRepository {
  /**
   * Encuentra un usuario por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Encuentra un usuario por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario
   */
  create(email: string): Promise<User>;
}
