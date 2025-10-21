/**
 * Users Service
 * Lógica de negocio para usuarios
 */

import { User, LoginResponse } from '@atom-challenge/shared';
import { UsersRepository } from '../repositories/users.repository';
import { signToken } from '../auth/jwt';

/**
 * Servicio de usuarios
 */
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  /**
   * Login por email
   * Si el usuario no existe, retorna null
   */
  async login(email: string): Promise<LoginResponse | null> {
    // Buscar usuario por email
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    // Generar token JWT
    const token = signToken(user.id, user.email);

    return {
      token,
      user,
    };
  }

  /**
   * Crear nuevo usuario
   * @throws Error si el usuario ya existe
   */
  async createUser(email: string): Promise<LoginResponse> {
    // Verificar que el usuario no exista
    const existing = await this.usersRepository.findByEmail(email);

    if (existing) {
      throw new Error('El usuario ya existe');
    }

    // Crear usuario
    const user = await this.usersRepository.create(email);

    // Generar token JWT
    const token = signToken(user.id, user.email);

    return {
      token,
      user,
    };
  }

  /**
   * Obtener usuario por ID
   */
  async getById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }
}
