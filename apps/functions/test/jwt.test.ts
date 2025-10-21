/**
 * JWT Utilities Tests
 */

import { signToken, verifyToken } from '../src/core/auth/jwt';

describe('JWT Utilities', () => {
  const testUserId = 'user123';
  const testEmail = 'test@example.com';

  describe('signToken', () => {
    it('should generate a valid JWT token', () => {
      const token = signToken(testUserId, testEmail);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes
    });

    it('should include user data in payload', () => {
      const token = signToken(testUserId, testEmail);
      const payload = verifyToken(token);

      expect(payload.sub).toBe(testUserId);
      expect(payload.email).toBe(testEmail);
    });
  });

  describe('verifyToken', () => {
    it('should decode a valid token', () => {
      const token = signToken(testUserId, testEmail);
      const payload = verifyToken(token);

      expect(payload.sub).toBe(testUserId);
      expect(payload.email).toBe(testEmail);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow('Token inválido');
    });

    it('should throw error for malformed token', () => {
      expect(() => verifyToken('notajwt')).toThrow('Token inválido');
    });
  });
});
