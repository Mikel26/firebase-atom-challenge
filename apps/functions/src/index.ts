/**
 * Cloud Functions entry point
 */

import { onRequest } from 'firebase-functions/v2/https';
import app from './app';

/**
 * API Cloud Function
 * Expone la aplicación Express como una Cloud Function HTTP
 */
export const api = onRequest(
  {
    cors: false, // CORS manejado por Express
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
  },
  app
);
