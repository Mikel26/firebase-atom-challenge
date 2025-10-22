/**
 * Firestore Admin SDK Configuration
 */

import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || 'atom-challenge-mikel',
  });
}

/**
 * Instancia de Firestore
 * Conecta a la base de datos 'db-testing'
 */
const firestoreSettings = {
  databaseId: 'db-testing',
};
export const db = admin.firestore();
db.settings(firestoreSettings);

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
