/**
 * Users Service Tests
 */

import { UsersService } from '../src/core/services/users.service';
import { UsersRepository } from '../src/core/repositories/users.repository';
import { User } from '@atom-challenge/shared';

// Mock repository
class MockUsersRepository implements UsersRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async create(email: string): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  // Helper para tests
  reset(): void {
    this.users = [];
  }
}

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockUsersRepository;

  beforeEach(() => {
    repository = new MockUsersRepository();
    service = new UsersService(repository);
  });

  describe('login', () => {
    it('should return null if user does not exist', async () => {
      const result = await service.login('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should return token and user if user exists', async () => {
      // Crear usuario primero
      const email = 'existing@example.com';
      await repository.create(email);

      // Intentar login
      const result = await service.login(email);

      expect(result).not.toBeNull();
      expect(result?.token).toBeDefined();
      expect(result?.user.email).toBe(email);
    });

    it('should generate a valid JWT token on login', async () => {
      const email = 'test@example.com';
      await repository.create(email);

      const result = await service.login(email);

      expect(result?.token).toBeDefined();
      expect(typeof result?.token).toBe('string');
      expect(result?.token.split('.')).toHaveLength(3);
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const email = 'newuser@example.com';

      const result = await service.createUser(email);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.id).toBeDefined();
      expect(result.user.createdAt).toBeDefined();
    });

    it('should throw error if user already exists', async () => {
      const email = 'duplicate@example.com';

      // Crear usuario
      await service.createUser(email);

      // Intentar crear de nuevo
      await expect(service.createUser(email)).rejects.toThrow('El usuario ya existe');
    });

    it('should generate JWT token for new user', async () => {
      const email = 'newuser@example.com';

      const result = await service.createUser(email);

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });
  });

  describe('getById', () => {
    it('should return user if exists', async () => {
      const email = 'test@example.com';
      const created = await repository.create(email);

      const user = await service.getById(created.id);

      expect(user).not.toBeNull();
      expect(user?.id).toBe(created.id);
      expect(user?.email).toBe(email);
    });

    it('should return null if user does not exist', async () => {
      const user = await service.getById('nonexistent-id');

      expect(user).toBeNull();
    });
  });
});
