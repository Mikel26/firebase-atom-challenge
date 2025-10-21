/**
 * Tasks Service Tests
 */

import { TasksService } from '../src/core/services/tasks.service';
import { TasksRepository } from '../src/core/repositories/tasks.repository';
import { Task } from '@atom-challenge/shared';

// Mock repository
class MockTasksRepository implements TasksRepository {
  private tasks: Task[] = [];

  async findByUserId(userId: string, limit?: number): Promise<Task[]> {
    let filtered = this.tasks.filter((t) => t.userId === userId);
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) || null;
  }

  async create(userId: string, title: string, description?: string): Promise<Task> {
    const task: Task = {
      id: `task-${Date.now()}`,
      userId,
      title,
      description: description || '',
      createdAt: new Date().toISOString(),
      completed: false,
    };
    this.tasks.push(task);
    return task;
  }

  async update(
    id: string,
    data: { title?: string; description?: string; completed?: boolean }
  ): Promise<Task | null> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;

    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.completed !== undefined) task.completed = data.completed;

    return task;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  // Helper para tests
  reset(): void {
    this.tasks = [];
  }
}

describe('TasksService', () => {
  let service: TasksService;
  let repository: MockTasksRepository;
  const user1Id = 'user1';
  const user2Id = 'user2';

  beforeEach(() => {
    repository = new MockTasksRepository();
    service = new TasksService(repository);
  });

  describe('listByUser', () => {
    it('should return empty array for user with no tasks', async () => {
      const tasks = await service.listByUser(user1Id);

      expect(tasks).toEqual([]);
    });

    it('should return only tasks owned by user', async () => {
      // Crear tareas para user1
      await repository.create(user1Id, 'Task 1');
      await repository.create(user1Id, 'Task 2');
      // Crear tarea para user2
      await repository.create(user2Id, 'Task 3');

      const tasks = await service.listByUser(user1Id);

      expect(tasks).toHaveLength(2);
      expect(tasks.every((t) => t.userId === user1Id)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      await repository.create(user1Id, 'Task 1');
      await repository.create(user1Id, 'Task 2');
      await repository.create(user1Id, 'Task 3');

      const tasks = await service.listByUser(user1Id, 2);

      expect(tasks).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('should return null if task does not exist', async () => {
      const task = await service.getById('nonexistent', user1Id);

      expect(task).toBeNull();
    });

    it('should return task if user is owner', async () => {
      const created = await repository.create(user1Id, 'My Task');

      const task = await service.getById(created.id, user1Id);

      expect(task).not.toBeNull();
      expect(task?.id).toBe(created.id);
    });

    it('should throw error if user is not owner', async () => {
      const created = await repository.create(user1Id, 'My Task');

      await expect(service.getById(created.id, user2Id)).rejects.toThrow(
        'No tienes permiso para acceder a esta tarea'
      );
    });
  });

  describe('create', () => {
    it('should create task successfully', async () => {
      const task = await service.create(user1Id, 'New Task', 'Description');

      expect(task).toBeDefined();
      expect(task.userId).toBe(user1Id);
      expect(task.title).toBe('New Task');
      expect(task.description).toBe('Description');
      expect(task.completed).toBe(false);
    });

    it('should create task without description', async () => {
      const task = await service.create(user1Id, 'New Task');

      expect(task.description).toBe('');
    });
  });

  describe('update', () => {
    it('should update task if user is owner', async () => {
      const created = await repository.create(user1Id, 'Original', 'Original desc');

      const updated = await service.update(created.id, user1Id, {
        title: 'Updated',
        completed: true,
      });

      expect(updated).not.toBeNull();
      expect(updated?.title).toBe('Updated');
      expect(updated?.completed).toBe(true);
    });

    it('should return null if task does not exist', async () => {
      const updated = await service.update('nonexistent', user1Id, { title: 'Test' });

      expect(updated).toBeNull();
    });

    it('should throw error if user is not owner', async () => {
      const created = await repository.create(user1Id, 'Task');

      await expect(service.update(created.id, user2Id, { title: 'Hacked' })).rejects.toThrow(
        'No tienes permiso'
      );
    });
  });

  describe('delete', () => {
    it('should delete task if user is owner', async () => {
      const created = await repository.create(user1Id, 'Task to delete');

      const deleted = await service.delete(created.id, user1Id);

      expect(deleted).toBe(true);
      const task = await repository.findById(created.id);
      expect(task).toBeNull();
    });

    it('should return false if task does not exist', async () => {
      const deleted = await service.delete('nonexistent', user1Id);

      expect(deleted).toBe(false);
    });

    it('should throw error if user is not owner', async () => {
      const created = await repository.create(user1Id, 'Task');

      await expect(service.delete(created.id, user2Id)).rejects.toThrow('No tienes permiso');
    });
  });
});
