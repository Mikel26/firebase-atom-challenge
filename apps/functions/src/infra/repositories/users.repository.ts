/**
 * Firestore Users Repository Implementation
 */

import { User } from '@atom-challenge/shared';
import { UsersRepository } from '../../core/repositories/users.repository';
import { usersCollection, generateId } from '../firestore';

/**
 * Implementación de UsersRepository con Firestore
 */
export class FirestoreUsersRepository implements UsersRepository {
  /**
   * Encuentra un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await usersCollection().where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  /**
   * Encuentra un usuario por ID
   */
  async findById(id: string): Promise<User | null> {
    const doc = await usersCollection().doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id: doc.id, ...doc.data() } as User;
  }

  /**
   * Crea un nuevo usuario
   */
  async create(email: string): Promise<User> {
    const id = generateId();
    const now = new Date().toISOString();

    const user: User = {
      id,
      email,
      createdAt: now,
    };

    await usersCollection().doc(id).set({
      email: user.email,
      createdAt: user.createdAt,
    });

    return user;
  }
}
