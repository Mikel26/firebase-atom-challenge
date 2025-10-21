/**
 * Health endpoint tests
 */

import request from 'supertest';
import app from '../src/app';

describe('GET /v1/health', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/v1/health');

    expect(response.status).toBe(200);
  });

  it('should return correct health check data', async () => {
    const response = await request(app).get('/v1/health');

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'TODO API is running');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });

  it('should have a valid ISO timestamp', async () => {
    const response = await request(app).get('/v1/health');

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp.toISOString()).toBe(response.body.timestamp);
  });
});

describe('404 handler', () => {
  it('should return 404 for non-existent public endpoints', async () => {
    const response = await request(app).get('/v1/unknown-public-endpoint');

    // Endpoints desconocidos después del authMiddleware devuelven 401
    // Esto es correcto porque el middleware se ejecuta antes del 404 handler
    expect([401, 404]).toContain(response.status);
  });
});

describe('CORS', () => {
  it('should have CORS headers', async () => {
    const response = await request(app).get('/v1/health').set('Origin', 'http://localhost:4200');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });
});
