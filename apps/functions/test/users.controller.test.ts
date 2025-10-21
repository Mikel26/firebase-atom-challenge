/**
 * Users Controller Tests
 */

import request from 'supertest';
import app from '../src/app';

// Mock Firestore para evitar dependencia de emuladores en tests
interface MockUser {
  id: string;
  email: string;
  createdAt: string;
}

const users = new Map<string, MockUser>();
const usersByEmail = new Map<string, MockUser>();

jest.mock('../src/infra/firestore', () => ({
  usersCollection: jest.fn(() => ({
    where: jest.fn((_field: string, _op: string, value: string) => ({
      limit: jest.fn(() => ({
        get: jest.fn(
          async (): Promise<{
            empty: boolean;
            docs: Array<{ id: string; data: () => MockUser }>;
          }> => {
            const user = usersByEmail.get(value);
            return {
              empty: !user,
              docs: user ? [{ id: user.id, data: (): MockUser => user }] : [],
            };
          }
        ),
      })),
    })),
    doc: jest.fn((id: string) => ({
      get: jest.fn(
        async (): Promise<{ exists: boolean; id: string; data: () => MockUser | undefined }> => {
          const user = users.get(id);
          return {
            exists: !!user,
            id,
            data: (): MockUser | undefined => user,
          };
        }
      ),
      set: jest.fn(async (data: Omit<MockUser, 'id'>): Promise<void> => {
        const userData: MockUser = { ...data, id };
        users.set(id, userData);
        usersByEmail.set(data.email, userData);
      }),
    })),
  })),
  generateId: jest.fn(() => `user-${Date.now()}-${Math.random()}`),
  db: {},
  tasksCollection: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe('Users Endpoints', () => {
  describe('POST /v1/users/login', () => {
    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/v1/users/login').send({
        email: 'invalid-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app).post('/v1/users/login').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).post('/v1/users/login').send({
        email: 'nonexistent@example.com',
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toContain('no encontrado');
    });

    it('should return 200 with token for existing user', async () => {
      // Crear usuario primero
      const email = `test-${Date.now()}@example.com`;
      await request(app).post('/v1/users').send({ email });

      // Hacer login
      const response = await request(app).post('/v1/users/login').send({ email });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(email);
    });
  });

  describe('POST /v1/users', () => {
    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/v1/users').send({
        email: 'not-an-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app).post('/v1/users').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should create user and return 201 with token', async () => {
      const email = `newuser-${Date.now()}@example.com`;

      const response = await request(app).post('/v1/users').send({ email });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(email);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.createdAt).toBeDefined();
    });

    it('should return 409 if user already exists', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      // Crear usuario
      await request(app).post('/v1/users').send({ email });

      // Intentar crear de nuevo
      const response = await request(app).post('/v1/users').send({ email });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Conflict');
      expect(response.body.message).toContain('ya existe');
    });

    it('should return valid JWT token', async () => {
      const email = `jwt-test-${Date.now()}@example.com`;

      const response = await request(app).post('/v1/users').send({ email });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      // JWT tiene 3 partes separadas por puntos
      expect(response.body.token.split('.')).toHaveLength(3);
    });
  });
});
