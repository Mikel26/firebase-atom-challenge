/**
 * Express Application
 * API REST para TODO App
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as usersController from './api/users.controller';

// Inicializar app
const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS - permitir orígenes específicos
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:4200', 'http://localhost:5002'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'TODO API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Users routes (public - no auth required)
app.post('/api/users/login', usersController.login);
app.post('/api/users', usersController.createUser);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;
