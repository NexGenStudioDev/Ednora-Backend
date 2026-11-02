import http from 'http';
import express from 'express';
import cors from 'cors';
import { jest } from '@jest/globals';
import {
  DEFAULT_FALLBACK_ORIGIN,
  DEFAULT_ALLOWED_ORIGINS,
  getAllowedOrigins,
  isOriginAllowed,
  resolveFrontendOrigin,
  createCorsOptions,
} from '../utils/origin.utils.mjs';

describe('CORS and Origin Resolution Suite', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('1. Environment Parsing and Allowlist Validation', () => {
    it('should split ALLOWED_ORIGINS on comma, trim whitespace, and normalize trailing slashes', () => {
      process.env.ALLOWED_ORIGINS =
        ' https://www.growrichmindset.in/ , http://localhost:1420/ , tauri://localhost , http://tauri.localhost ';
      const origins = getAllowedOrigins();

      expect(origins).toContain('https://www.growrichmindset.in');
      expect(origins).toContain('http://localhost:1420');
      expect(origins).toContain('tauri://localhost');
      expect(origins).toContain('http://tauri.localhost');
      // Verify trimmed and no trailing slashes
      expect(origins).not.toContain('https://www.growrichmindset.in/');
      expect(origins).not.toContain(' http://localhost:1420/ ');
    });

    it('should fall back to default origins if ALLOWED_ORIGINS is empty or unset', () => {
      delete process.env.ALLOWED_ORIGINS;
      const origins = getAllowedOrigins();

      for (const expected of DEFAULT_ALLOWED_ORIGINS) {
        expect(origins).toContain(expected);
      }
    });

    it('should validate allowed origins correctly with isOriginAllowed', () => {
      process.env.ALLOWED_ORIGINS =
        'https://www.growrichmindset.in,http://localhost:1420,tauri://localhost,http://tauri.localhost';

      expect(isOriginAllowed('https://www.growrichmindset.in')).toBe(true);
      expect(isOriginAllowed('https://www.growrichmindset.in/')).toBe(true);
      expect(isOriginAllowed('http://localhost:1420')).toBe(true);
      expect(isOriginAllowed('tauri://localhost')).toBe(true);
      expect(isOriginAllowed('http://tauri.localhost')).toBe(true);

      // Disallowed origins
      expect(isOriginAllowed('http://malicious.site.com')).toBe(false);
      expect(isOriginAllowed('http://localhost:3001')).toBe(false);
      expect(isOriginAllowed('null')).toBe(false);
      expect(isOriginAllowed('')).toBe(false);
      expect(isOriginAllowed(null)).toBe(false);
    });
  });

  describe('2. resolveFrontendOrigin (Auth / Redirect / Link Handling)', () => {
    it('should return the validated origin when incoming Origin header is in ALLOWED_ORIGINS', () => {
      process.env.ALLOWED_ORIGINS =
        'https://www.growrichmindset.in,http://localhost:1420,tauri://localhost,http://tauri.localhost';

      const mockReqTauri = { headers: { origin: 'http://localhost:1420' } };
      expect(resolveFrontendOrigin(mockReqTauri)).toBe('http://localhost:1420');

      const mockReqMac = { headers: { origin: 'tauri://localhost' } };
      expect(resolveFrontendOrigin(mockReqMac)).toBe('tauri://localhost');

      const mockReqWin = { headers: { origin: 'http://tauri.localhost' } };
      expect(resolveFrontendOrigin(mockReqWin)).toBe('http://tauri.localhost');

      const mockReqProd = {
        headers: { origin: 'https://www.growrichmindset.in' },
      };
      expect(resolveFrontendOrigin(mockReqProd)).toBe(
        'https://www.growrichmindset.in'
      );
    });

    it('should fall back to https://www.growrichmindset.in when Origin header is absent (curl, SSR, native calls)', () => {
      delete process.env.FRONTEND_URL;
      const reqNoOrigin = { headers: {} };
      expect(resolveFrontendOrigin(reqNoOrigin)).toBe(DEFAULT_FALLBACK_ORIGIN);
      expect(resolveFrontendOrigin(null)).toBe(DEFAULT_FALLBACK_ORIGIN);
    });

    it('should reject unvalidated Origin headers and safely return fallback (preventing open-redirect)', () => {
      delete process.env.FRONTEND_URL;
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const reqMalicious = {
        headers: { origin: 'https://evil-phishing-site.com' },
      };

      const resolved = resolveFrontendOrigin(reqMalicious);
      expect(resolved).toBe(DEFAULT_FALLBACK_ORIGIN);
      expect(resolved).not.toContain('evil-phishing-site.com');
      consoleSpy.mockRestore();
    });
  });

  describe('3. Express CORS Middleware Integration Tests', () => {
    let server;
    let baseUrl;

    beforeAll(async () => {
      process.env.ALLOWED_ORIGINS =
        'https://www.growrichmindset.in,http://localhost:1420,tauri://localhost,http://tauri.localhost';

      const app = express();
      const corsOptions = createCorsOptions();
      app.use(cors(corsOptions));
      app.options('*', cors(corsOptions));

      app.get('/api/test-cors', (req, res) => {
        res.status(200).json({ ok: true });
      });

      server = http.createServer(app);
      await new Promise((resolve) => server.listen(0, resolve));
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
    });

    afterAll(async () => {
      if (server) {
        await new Promise((resolve) => server.close(resolve));
      }
    });

    it('should allow https://www.growrichmindset.in with exact ACAO and credentials: true', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'https://www.growrichmindset.in' },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'https://www.growrichmindset.in'
      );
      expect(res.headers.get('access-control-allow-credentials')).toBe('true');
      expect(res.headers.get('access-control-allow-origin')).not.toBe('*');
    });

    it('should allow https://growrichmindset.in (without www) with exact ACAO and credentials: true', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'https://growrichmindset.in' },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'https://growrichmindset.in'
      );
      expect(res.headers.get('access-control-allow-credentials')).toBe('true');
    });

    it('should allow http://localhost:1420 (Tauri dev) with exact ACAO and credentials: true', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'http://localhost:1420' },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'http://localhost:1420'
      );
      expect(res.headers.get('access-control-allow-credentials')).toBe('true');
    });

    it('should allow tauri://localhost (Tauri macOS/Linux) with exact ACAO', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'tauri://localhost' },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'tauri://localhost'
      );
      expect(res.headers.get('access-control-allow-credentials')).toBe('true');
    });

    it('should allow http://tauri.localhost (Tauri Windows) with exact ACAO', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'http://tauri.localhost' },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'http://tauri.localhost'
      );
      expect(res.headers.get('access-control-allow-credentials')).toBe('true');
    });

    it('should succeed for requests with no Origin header (curl, SSR, native calls)', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ok).toBe(true);
      // No ACAO header when no Origin header was present
      expect(res.headers.get('access-control-allow-origin')).toBeNull();
    });

    it('should NOT set Access-Control-Allow-Origin for disallowed origins', async () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const res = await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'http://unauthorized-domain.com' },
      });

      expect(res.headers.get('access-control-allow-origin')).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should handle preflight OPTIONS for allowed origin with custom headers (Authorization, Content-Type, X-App-Version)', async () => {
      const res = await fetch(`${baseUrl}/api/test-cors`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:1420',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers':
            'authorization, content-type, x-app-version',
        },
      });

      expect(res.status).toBe(204);
      expect(res.headers.get('access-control-allow-origin')).toBe(
        'http://localhost:1420'
      );
      expect(res.headers.get('access-control-allow-credentials')).toBe('true');

      const allowHeaders = (
        res.headers.get('access-control-allow-headers') || ''
      ).toLowerCase();
      expect(allowHeaders).toContain('authorization');
      expect(allowHeaders).toContain('content-type');
      expect(allowHeaders).toContain('x-app-version');
    });

    it('should fail preflight for disallowed origin (no ACAO header emitted)', async () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      const res = await fetch(`${baseUrl}/api/test-cors`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://disallowed-origin.com',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type, authorization',
        },
      });

      // Disallowed origin preflight gets NO Access-Control-Allow-Origin header
      expect(res.headers.get('access-control-allow-origin')).toBeNull();
      consoleSpy.mockRestore();
    });

    it('should log rejected Origin: null in development', async () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const previousNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      await fetch(`${baseUrl}/api/test-cors`, {
        headers: { Origin: 'null' },
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CORS] Rejected origin: "null"')
      );

      process.env.NODE_ENV = previousNodeEnv;
      consoleSpy.mockRestore();
    });
  });
});
