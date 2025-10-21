/**
 * Auth Middleware Tests
 */

import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../src/middleware/auth';
import { signToken } from '../src/core/auth/jwt';

// App de prueba con middleware
const testApp = express();
testApp.use(express.json());
testApp.get('/protected', authMiddleware, (req, res) => {
  const authReq = req as typeof req & { user?: { sub: string } };
  res.status(200).json({ message: 'OK', userId: authReq.user?.sub });
});

describe('Auth Middleware', () => {
  const validToken = signToken('user123', 'test@example.com');

  it('should return 401 without Authorization header', async () => {
    const response = await request(testApp).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
    expect(response.body.message).toContain('requerido');
  });

  it('should return 401 with malformed header', async () => {
    const response = await request(testApp).get('/protected').set('Authorization', 'InvalidFormat');

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Formato de token inválido');
  });

  it('should return 401 with invalid token', async () => {
    const response = await request(testApp)
      .get('/protected')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('inválido');
  });

  it('should pass with valid token', async () => {
    const response = await request(testApp)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OK');
    expect(response.body.userId).toBe('user123');
  });

  it('should attach user payload to request', async () => {
    const response = await request(testApp)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBeDefined();
  });
});
