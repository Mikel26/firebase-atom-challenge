/**
 * Health endpoint tests
 */

import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
  });

  it('should return correct health check data', async () => {
    const response = await request(app).get('/api/health');

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message', 'TODO API is running');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });

  it('should have a valid ISO timestamp', async () => {
    const response = await request(app).get('/api/health');

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp.toISOString()).toBe(response.body.timestamp);
  });
});

describe('404 handler', () => {
  it('should return 404 for non-existent endpoints', async () => {
    const response = await request(app).get('/api/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('message', 'The requested endpoint does not exist');
  });
});

describe('CORS', () => {
  it('should have CORS headers', async () => {
    const response = await request(app).get('/api/health').set('Origin', 'http://localhost:4200');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });
});
