/**
 * Jest setup file
 * Configuración global para tests
 */

// Configurar Firestore para usar emulador en tests
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
process.env.GCLOUD_PROJECT = 'demo-atom-challenge';
