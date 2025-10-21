/**
 * Tasks Controller Tests
 */

import request from 'supertest';
import app from '../src/app';
import { signToken } from '../src/core/auth/jwt';

// Mock Firestore para tasks
interface MockTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
}

const tasks = new Map<string, MockTask>();

jest.mock('../src/infra/firestore', () => ({
  usersCollection: jest.fn(),
  tasksCollection: jest.fn(() => ({
    where: jest.fn((_field: string, _op: string, value: string) => ({
      orderBy: jest.fn(() => ({
        limit: jest.fn((lim: number) => ({
          get: jest.fn(async (): Promise<{ docs: Array<{ id: string; data: () => MockTask }> }> => {
            const filtered = Array.from(tasks.values()).filter((t) => t.userId === value);
            filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            const limited = filtered.slice(0, lim);
            return {
              docs: limited.map((t) => ({ id: t.id, data: () => t })),
            };
          }),
        })),
      })),
    })),
    doc: jest.fn((id: string) => ({
      get: jest.fn(
        async (): Promise<{ exists: boolean; id: string; data: () => MockTask | undefined }> => {
          const task = tasks.get(id);
          return {
            exists: !!task,
            id,
            data: () => task,
          };
        }
      ),
      set: jest.fn(async (data: Omit<MockTask, 'id'>) => {
        tasks.set(id, { ...data, id });
      }),
      update: jest.fn(async (data: Partial<MockTask>) => {
        const task = tasks.get(id);
        if (task) {
          tasks.set(id, { ...task, ...data });
        }
      }),
      delete: jest.fn(async () => {
        tasks.delete(id);
      }),
    })),
  })),
  generateId: jest.fn(() => `task-${Date.now()}-${Math.random()}`),
  db: {},
  serverTimestamp: jest.fn(),
}));

describe('Tasks Endpoints', () => {
  let token: string;
  const userId = 'test-user-123';
  const otherUserId = 'other-user-456';

  beforeAll(() => {
    token = signToken(userId, 'test@example.com');
  });

  beforeEach(() => {
    tasks.clear();
  });

  describe('GET /v1/tasks', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/v1/tasks');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app).get('/v1/tasks').set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(401);
    });

    it('should return empty array for user with no tasks', async () => {
      const response = await request(app).get('/v1/tasks').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return only user tasks', async () => {
      // Crear tarea del usuario autenticado
      const task1: MockTask = {
        id: 'task1',
        userId,
        title: 'My Task',
        description: '',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      tasks.set('task1', task1);

      // Crear tarea de otro usuario
      const task2: MockTask = {
        id: 'task2',
        userId: otherUserId,
        title: 'Other Task',
        description: '',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      tasks.set('task2', task2);

      const response = await request(app).get('/v1/tasks').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].userId).toBe(userId);
    });
  });

  describe('POST /v1/tasks', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).post('/v1/tasks').send({
        title: 'New Task',
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'ab', // Muy corto (min 3)
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should create task successfully', async () => {
      const response = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Task',
          description: 'Task description',
        });

      expect(response.status).toBe(201);
      expect(response.body.userId).toBe(userId);
      expect(response.body.title).toBe('New Task');
      expect(response.body.description).toBe('Task description');
      expect(response.body.completed).toBe(false);
    });
  });

  describe('PATCH /v1/tasks/:id', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).patch('/v1/tasks/task1').send({
        completed: true,
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 for nonexistent task', async () => {
      const response = await request(app)
        .patch('/v1/tasks/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          completed: true,
        });

      expect(response.status).toBe(404);
    });

    it('should return 403 if not owner', async () => {
      const task: MockTask = {
        id: 'task1',
        userId: otherUserId,
        title: 'Other Task',
        description: '',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      tasks.set('task1', task);

      const response = await request(app)
        .patch('/v1/tasks/task1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          completed: true,
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
    });

    it('should update task successfully', async () => {
      const task: MockTask = {
        id: 'task1',
        userId,
        title: 'Original',
        description: 'Desc',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      tasks.set('task1', task);

      const response = await request(app)
        .patch('/v1/tasks/task1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated',
          completed: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated');
      expect(response.body.completed).toBe(true);
    });
  });

  describe('DELETE /v1/tasks/:id', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).delete('/v1/tasks/task1');

      expect(response.status).toBe(401);
    });

    it('should return 404 for nonexistent task', async () => {
      const response = await request(app)
        .delete('/v1/tasks/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('should return 403 if not owner', async () => {
      const task: MockTask = {
        id: 'task1',
        userId: otherUserId,
        title: 'Other Task',
        description: '',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      tasks.set('task1', task);

      const response = await request(app)
        .delete('/v1/tasks/task1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });

    it('should delete task successfully', async () => {
      const task: MockTask = {
        id: 'task1',
        userId,
        title: 'To Delete',
        description: '',
        createdAt: new Date().toISOString(),
        completed: false,
      };
      tasks.set('task1', task);

      const response = await request(app)
        .delete('/v1/tasks/task1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(tasks.has('task1')).toBe(false);
    });
  });
});
