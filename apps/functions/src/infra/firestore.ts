/**
 * Firestore Admin SDK Configuration
 */

import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Instancia de Firestore
 */
export const db = admin.firestore();

/**
 * Referencia a la colección de usuarios
 */
export const usersCollection = (): admin.firestore.CollectionReference => db.collection('users');

/**
 * Referencia a la colección de tareas
 */
export const tasksCollection = (): admin.firestore.CollectionReference => db.collection('tasks');

/**
 * Genera un timestamp de servidor
 */
export const serverTimestamp = (): admin.firestore.FieldValue =>
  admin.firestore.FieldValue.serverTimestamp();

/**
 * Genera un ID único
 */
export const generateId = (): string => db.collection('_').doc().id;
