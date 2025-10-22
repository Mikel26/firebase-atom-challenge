/**
 * OpenAPI Documentation Configuration
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TODO App API',
      version: '1.0.0',
      description:
        'API REST para aplicación TODO con autenticación JWT y gestión de tareas por usuario',
      contact: {
        name: 'Mikel Ortega',
        email: 'mikel.ortega26@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001/demo-atom-challenge/us-central1/api/v1',
        description: 'Development server (Emulators)',
      },
      {
        url: 'https://us-central1-atom-challenge-mikel.cloudfunctions.net/api/v1',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Users',
        description: 'User authentication endpoints (public)',
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints (protected - requires JWT)',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenido del endpoint de login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único del usuario',
              example: 'user-1729526400000',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación en formato ISO',
              example: '2025-10-21T18:30:00.000Z',
            },
          },
          required: ['id', 'email', 'createdAt'],
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único de la tarea',
              example: 'task-1729526400000',
            },
            userId: {
              type: 'string',
              description: 'ID del usuario propietario',
              example: 'user-1729526400000',
            },
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 80,
              description: 'Título de la tarea',
              example: 'Comprar leche',
            },
            description: {
              type: 'string',
              maxLength: 200,
              description: 'Descripción opcional de la tarea',
              example: 'Ir al supermercado antes de las 5pm',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2025-10-21T18:30:00.000Z',
            },
            completed: {
              type: 'boolean',
              description: 'Indica si la tarea está completada',
              example: false,
            },
          },
          required: ['id', 'userId', 'title', 'createdAt', 'completed'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com',
            },
          },
          required: ['email'],
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token válido por 7 días',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
          required: ['token', 'user'],
        },
        CreateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 80,
              description: 'Título de la tarea',
              example: 'Comprar leche',
            },
            description: {
              type: 'string',
              maxLength: 200,
              description: 'Descripción opcional',
              example: 'Ir al supermercado',
            },
          },
          required: ['title'],
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 80,
              description: 'Nuevo título',
              example: 'Comprar leche y pan',
            },
            description: {
              type: 'string',
              maxLength: 200,
              description: 'Nueva descripción',
              example: 'Ir al supermercado a las 5pm',
            },
            completed: {
              type: 'boolean',
              description: 'Estado de completado',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo de error',
              example: 'Bad Request',
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo del error',
              example: 'Email inválido',
            },
            details: {
              type: 'array',
              description: 'Detalles de validación (opcional)',
              items: {
                type: 'object',
              },
            },
          },
          required: ['error', 'message'],
        },
      },
    },
  },
  apis: ['./src/app.ts', './src/docs/*.docs.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
